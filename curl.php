<?php
    if ($_SERVER['REQUEST_METHOD'] == 'POST' && empty($_POST))
        $_POST = json_decode(file_get_contents('php://input'), true);

    $linkid = isset($_POST['linkid'])?$_POST['linkid']:'';
    $sort = isset($_POST['sort'])?$_POST['sort']:'';
    $children = isset($_POST['children'])?$_POST['children']:'';
    $depth = isset($_POST['depth'])?$_POST['depth']:'';
    $limitchildren = isset($_POST['limitchildren'])?$_POST['limitchildren']:'';
    $action = isset($_GET['action'])?$_GET['action']:'';
    $link = isset($_GET['link'])?$_GET['link']:'';
    $type = isset($_GET['type'])?$_GET['type']:'';

    $ch = curl_init();
    $api = '';
    if($action == 'getPosts'){
        $api = 'https://www.reddit.com/'.$type.'/.json';
    }
    else if($action == 'getComments'){
        $api = 'https://www.reddit.com/'.$link.'/.json';
    }
    else{
        $api = 'https://www.reddit.com/api/morechildren';
        curl_setopt($ch, CURLOPT_POSTFIELDS,"link_id=".$linkid."&sort=".$sort."&children=".$children."&depth=".$depth."&limit_children=".$limitchildren);
    }
    
    curl_setopt($ch, CURLOPT_URL, $api);
    curl_setopt($ch, CURLOPT_HEADER, false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); 
    $result = curl_exec($ch);
    curl_close($ch);
    $result=json_decode($result,1);
    echo json_encode($result);
?>