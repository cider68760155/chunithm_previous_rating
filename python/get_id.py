import json
import requests
import datetime


def main():
    with open('version_info.json') as f:
        ret = []
        version_info = json.load(f)
        for i in range(len(version_info)):
            since = datetime.date(
                version_info[i]['y'], version_info[i]['m'], version_info[i]['d'])
            if i == len(version_info) - 1:
                until = datetime.date(2050, 1, 1)
            else:
                until = datetime.date(
                    version_info[i + 1]['y'], version_info[i + 1]['m'], version_info[i + 1]['d'] - 1)
            song_id_list = get_song_id_list(since, until)
            assert len(song_id_list) < 200
            ret.append({
                "version": version_info[i]["name"],
                "id": song_id_list
            })
    with open('../song_id.json', 'w') as f:
        json.dump(ret, f, ensure_ascii=False)


def get_token() -> str:
    """
    Return:
    chunirecのAPIトークン
    """
    with open('../token.json') as f:
        token = json.load(f)
    return token['CHUNIREC_TOKEN']


def get_song_id_list(since: datetime.date, until: datetime.date):
    """
    Return:
    since以降、until以前に追加された曲のIDのリスト
    """
    req_url = "https://api.chunirec.net/2.0/music/search.json"
    req = requests.get(req_url+"?region=jp2&token="+get_token() +
                       "&q=since:"+since.strftime("%Y-%m-%d") +
                       " until:"+until.strftime("%Y-%m-%d"))
    return [song['id'] for song in req.json()]


if __name__ == '__main__':
    main()
