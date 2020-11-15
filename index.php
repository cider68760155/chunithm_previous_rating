<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>昔の人はすごかった</title>
    <meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0">
</head>

<body>
    <h1>昔の人はすごかった</h1>
    <div>各バージョンまでの楽曲のみでベスト枠を計算します。</div>
    <form action="index.php" method="post">
        <input type="text" name="chunirec_id" placeholder="chunirecのユーザーID">
        <input type="submit" value="送信">
    </form>
    <div id="result"></div>
    <script type="text/javascript">
        var result_json =
            <?php
            function curl_get_contents($url, $timeout = 60)
            {
                $ch = curl_init();
                curl_setopt($ch, CURLOPT_URL, $url);
                curl_setopt($ch, CURLOPT_HEADER, false);
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($ch, CURLOPT_TIMEOUT, $timeout);
                $result = curl_exec($ch);
                curl_close($ch);
                return $result;
            }
            ini_set('display_errors', "On");
            if (!array_key_exists('chunirec_id', $_POST)) {
                return;
            } else {
                $chunirec_id = $_POST['chunirec_id'];
            }
            require_once "JSON.php";
            $json = new Services_JSON;
            $token_json = file_get_contents('./token.json');
            $chunirec_token = $json->decode($token_json)->{'CHUNIREC_TOKEN'};
            $result_json = curl_get_contents("https://api.chunirec.net/1.2/records/showall.json?token=" . $chunirec_token . "&user_name=" . $chunirec_id);
            echo $result_json
            ?>;
    </script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.5.2/jquery.min.js"></script>
    <script src="index.js"></script>
</body>

</html>