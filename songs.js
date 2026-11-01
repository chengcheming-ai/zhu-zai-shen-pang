/* =========================================================
   網站設定檔：日常更新只需要改這個檔案
   ========================================================= */
window.SITE = {
  channelUrl: "https://www.youtube.com/channel/UCmoZoat_37Zbqo-Zpnze0TA",

  /* 收款連結：開通斗內平台後，把網址貼在引號內（須為 https:// 開頭）。
     留空時，網頁會顯示「贊助功能準備中」，不會出現可點擊的付款按鈕。 */
  donateUrl: "",

  /* 付款頁實際提供的方式，請依開通結果修改 */
  payMethods: ["LINE Pay", "ATM 轉帳", "信用卡"],

  /* 聯絡信箱：留空時不顯示 */
  contactEmail: ""
};

/* 詩歌分類名稱。每首歌的分類與經文都在 catalog.js。 */
window.THEMES = ["歡呼讚美", "恩典喜樂", "晨光盼望", "安靜親近", "榮耀敬拜"];

/* 背景畫作：皆為公有領域或 CC0 作品。bible 是畫作對應的聖經段落，
   holder 是維基共享資源記載的典藏處或來源，url 是該圖的檔案頁。 */
window.BACKGROUNDS = [
  { file: "jerusalem.jpg", title: "從橄欖山遠眺耶路撒冷", en: "Jerusalem from the Mount of Olives", artist: "弗雷德里克·埃德溫·丘奇", year: "1870", holder: "納爾遜-阿特金斯藝術博物館（美國）", bible: "路加福音 19:37-41", license: "公有領域", url: "https://commons.wikimedia.org/wiki/File:Frederic_Edwin_Church_-_Jerusalem_from_the_Mount_of_Olives_-_Google_Art_Project.jpg" },
  { file: "ruth.jpg", title: "路得與波阿斯的風景", en: "Landscape with Ruth and Boaz", artist: "約瑟夫·安東·科赫", year: "約 1823–1825", holder: "密爾瓦基藝術博物館（美國）", bible: "路得記 2 章", license: "公有領域", url: "https://commons.wikimedia.org/wiki/File:Joseph_Anton_Koch_-_Landschaft_mit_Ruth_und_Boas_(1823-1825).jpg" },
  { file: "sermon.jpg", title: "登山寶訓", en: "The Sermon on the Mount", artist: "老揚·布勒哲爾", year: "1598", holder: "蓋蒂中心（美國）", bible: "馬太福音 5–7 章", license: "公有領域", url: "https://commons.wikimedia.org/wiki/File:Jan_Brueghel_the_Elder_-_The_Sermon_on_the_Mount_-_Google_Art_Project.jpg" },
  { file: "storm.jpg", title: "基督在加利利海的風暴中", en: "Christ in the Storm on the Sea of Galilee", artist: "盧多夫·巴克赫伊森", year: "1695", holder: "印第安納波利斯藝術博物館（美國）", bible: "馬可福音 4:35-41", license: "公有領域", url: "https://commons.wikimedia.org/wiki/File:Backhuysen,_Ludolf,_I_-_Christ_in_the_Storm_on_the_Sea_of_Galilee_-_Google_Art_Project.jpg" },
  { file: "galilee.jpg", title: "耶穌在革尼撒勒湖上", en: "Jésus sur le lac de Génésareth", artist: "亞歷山大-加布里埃爾·德康", year: "19 世紀中葉", holder: "羅浮宮（法國）", bible: "路加福音 5:1-3", license: "公有領域", url: "https://commons.wikimedia.org/wiki/File:J%C3%A9sus_sur_le_lac_de_G%C3%A9n%C3%A9sareth_-_Alexandre-Gabriel_Decamps_-_Mus%C3%A9e_du_Louvre_Peintures_RF_1648.jpg" },
  { file: "ark.jpg", title: "挪亞方舟", en: "Noah's Ark", artist: "愛德華·希克斯", year: "1846", holder: "費城藝術博物館（美國）", bible: "創世記 6–8 章", license: "CC0", url: "https://commons.wikimedia.org/wiki/File:Noah%27s_Ark_by_Edward_Hicks,_1846_(Philadelphia_museum_of_art).jpg" },
  { file: "shepherds.jpg", title: "天使向牧羊人報信", en: "The Annunciation to the Shepherds", artist: "亞當·皮納克", year: "約 1650", holder: "蘇富比 2015 年拍賣圖錄", bible: "路加福音 2:8-14", license: "公有領域", url: "https://commons.wikimedia.org/wiki/File:Adam_Pynacker_-_Annunciation_to_the_Shepherds_216N09335_4D8WV.jpg" },
  { file: "samaritan.jpg", title: "好撒瑪利亞人的風景", en: "Landscape with the Good Samaritan", artist: "林布蘭", year: "1638", holder: "克拉科夫國家博物館（波蘭）", bible: "路加福音 10:25-37", license: "公有領域", url: "https://commons.wikimedia.org/wiki/File:Landscape_with_the_Good_Samaritan_-_Rembrandt.jpg" },
  { file: "emmaus.jpg", title: "往以馬忤斯的路上", en: "Christ on the Road to Emmaus", artist: "揚·維爾登斯", year: "1640 年代", holder: "艾爾米塔什博物館（俄羅斯）", bible: "路加福音 24:13-35", license: "公有領域", url: "https://commons.wikimedia.org/wiki/File:Jan_Wildens_Landscape_with_Christ_and_his_Disciples_on_the_Road_to_Emmaus.jpg" },
  { file: "genezareth.jpg", title: "耶穌與門徒在革尼撒勒湖畔", en: "Jesus and his Disciples on the Sea of Galilee", artist: "卡爾·厄斯特利", year: "1833", holder: "私人收藏（多羅特姆拍賣行）", bible: "路加福音 5:1-11", license: "公有領域", url: "https://commons.wikimedia.org/wiki/File:Carl_Wilhelm_Friedrich_Oesterley_d%C3%84_Jesus_am_See_Genezereth.jpg" }
];
