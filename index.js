(function () {
    main();
})();

function set_text(text) {
    $('#result').append('<div>');
    $('#result').append(text);
    $('#result').append('</div>')
}

function reset_text() {
    $('#result').empty();
}

function get_version_info() {
    let ret;
    let req = new XMLHttpRequest();
    req.addEventListener("load", function () {
        ret = this.responseText;
    });
    req.open("GET", "song_id.json", false);
    req.send();
    return ret;
}

function get_song_result_map(records) {
    let ret = {};
    for (let i = 0; i < records.length; ++i) {
        let id = records[i].id;
        if (id in ret) {
            ret[id].push(records[i].rating);
        }
        else {
            ret[id] = [records[i].rating];
        }
    }
    return ret;
}

function get_tweet_text(text) {
    text = text.replace(/<b>/g, '');
    text = text.replace(/<\/b>/g, '');
    text = text.replace(/<div>/g, '');
    text = text.replace(/<\/div>/g, '%0A');
    return text;
}

function main() {
    if ("error" in result_json) {
        let status_code = result_json.error.code;
        if (status_code == 429) {
            set_text("<div>chunirec APIのアクセス制限を超過しました</div>");
            set_text("<div>しばらく時間をおいて、再度お試しください</div>");
        }
        else if (status_code == 404) {
            set_text("ユーザーIDが間違っている、もしくはユーザー設定が非公開になっています");
        }
        else {
            set_text("chunirecへのアクセスエラーが発生しました");
            set_text(result_json.error.additional_message);
        }
        return;
    }
    version_info = JSON.parse(get_version_info());
    song_result_map = get_song_result_map(result_json.records);
    ratings = []
    let print_text = "";
    let tweet_text = "";
    for (let i = 0; i < version_info.length; ++i) {
        let version = version_info[i].version;
        for (let j = 0; j < version_info[i].id.length; ++j) {
            let id = version_info[i].id[j];
            if (id in song_result_map) {
                ratings = ratings.concat(song_result_map[id]);
            }
        }
        ratings.sort(function (a, b) { return b - a; });
        let sum = 0;
        for (let i = 0; i < Math.min(ratings.length, 30); ++i) {
            sum += ratings[i];
        }
        if (i == version_info.length - 1) {
            let to_push = "現在のベスト枠は<b>" + String(Math.floor(sum * 100 / 30) / 100) + "</b>です</div>";
            print_text = "<div>あなたの" + to_push + print_text;
            tweet_text = to_push + tweet_text;
        }
        else {
            let to_push = "<div>" + version + "までだと<b>" + String(Math.floor(sum * 100 / 30) / 100) + "</b>です</div>";
            print_text += to_push;
            if (i % 2 == 0) tweet_text += to_push;
        }
    }
    set_text(print_text);
    let tweet_url = 'https://twitter.com/intent/tweet';
    let site_url = "cider01.php.xdomain.jp/chunithm_previous_rating"
    set_text('<a href="' + tweet_url + '?text=' + get_tweet_text(tweet_text) + "&url=" + site_url + '">Tweet</a>');
}
