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

/* 經文：每次開啟網站隨機顯示一則，並連到主題相近的詩歌。
   內容採和合本（信望愛站資料）。songs 填歌曲的中文歌名。 */
window.VERSES = [
  { text: "耶和華要作王，直到永遠！錫安哪，你的神要作王，直到萬代！你們要讚美耶和華！", ref: "詩篇 146:10", songs: ["你永遠掌權"] },
  { text: "你們要嘗嘗主恩的滋味，便知道他是美善；投靠他的人有福了！", ref: "詩篇 34:8", songs: ["你真好", "主祢真好", "主你真美好", "你是良善", "恩典一路唱"] },
  { text: "你必將生命的道路指示我。在你面前有滿足的喜樂；在你右手中有永遠的福樂。", ref: "詩篇 16:11", songs: ["祢是我的喜樂", "同行的喜樂"] },
  { text: "普天下當向耶和華歡呼！", ref: "詩篇 100:1", songs: ["我要歡呼", "歡呼的心", "歡呼同在"] },
  { text: "我們的主，我們的神，你是配得榮耀、尊貴、權柄的；因為你創造了萬物，並且萬物是因你的旨意被創造而有的。", ref: "啟示錄 4:11", songs: ["祢配得最高讚美"] },
  { text: "我要時時稱頌耶和華；讚美他的話必常在我口中。", ref: "詩篇 34:1", songs: ["讚美不停息", "永不止息的讚美", "高舉你的名"] },
  { text: "眾城門哪，你們要抬起頭來！永久的門戶，你們要被舉起！那榮耀的王將要進來！", ref: "詩篇 24:7", songs: ["城門與晨光"] },
  { text: "若有人在基督裡，他就是新造的人，舊事已過，都變成新的了。", ref: "哥林多後書 5:17", songs: ["重生綻放", "因祢我敢夢"] },
  { text: "你們要休息，要知道我是神！我必在外邦中被尊崇，在遍地上也被尊崇。", ref: "詩篇 46:10", songs: ["安靜等候"] },
  { text: "來啊，我們要屈身敬拜，在造我們的耶和華面前跪下。", ref: "詩篇 95:6", songs: ["同來敬拜", "高聲敬拜"] },
  { text: "耶和華啊，早晨你必聽我的聲音；早晨我必向你陳明我的心意，並要警醒！", ref: "詩篇 5:3", songs: ["晨光裡敬拜"] },
  { text: "我要向山舉目；我的幫助從何而來？", ref: "詩篇 121:1", songs: ["抬起我的眼"] },
  { text: "耶和華是我的亮光，是我的拯救，我還怕誰呢？耶和華是我性命的保障，我還懼誰呢？", ref: "詩篇 27:1", songs: ["光中歡唱", "光中歡呼", "向光而歌"] },
  { text: "你們親近神，神就必親近你們。", ref: "雅各書 4:8 上", songs: ["靠近祢心", "向祢奔跑"] },
  { text: "他醫好傷心的人，裹好他們的傷處。", ref: "詩篇 147:3", songs: ["修補我心", "縫好的心", "把我抱緊"] },
  { text: "你們當向聖所舉手，稱頌耶和華！", ref: "詩篇 134:2", songs: ["把手舉起來"] },
  { text: "興起，發光！因為你的光已經來到！耶和華的榮耀發現照耀你。", ref: "以賽亞書 60:1", songs: ["亮光進來了", "起來歌唱"] },
  { text: "我們愛，因為神先愛我們。", ref: "約翰一書 4:19", songs: ["回應祢的愛", "阿爸真好"] },
  { text: "凡有氣息的都要讚美耶和華！你們要讚美耶和華！", ref: "詩篇 150:6", songs: ["同聲讚美", "一起唱哈利路亞"] },
  { text: "因為萬有都是本於他，倚靠他，歸於他。願榮耀歸給他，直到永遠。阿們！", ref: "羅馬書 11:36", songs: ["榮耀在這裡", "榮耀直到永遠", "歡呼榮耀歸給祢", "榮耀在此刻", "回到祢榮耀裡", "回應祢榮耀"] }
];

/* 詩歌分類：填歌曲的中文歌名。沒有列入的新歌只會出現在「全部」。 */
window.THEMES = [
  { name: "歡呼讚美", songs: ["你永遠掌權", "我要歡呼", "歡呼的心", "歡呼同在", "祢配得最高讚美", "讚美不停息", "永不止息的讚美", "高舉你的名", "同來敬拜", "高聲敬拜", "把手舉起來", "同聲讚美", "一起唱哈利路亞"] },
  { name: "恩典喜樂", songs: ["你真好", "主祢真好", "主你真美好", "你是良善", "恩典一路唱", "祢是我的喜樂", "同行的喜樂", "阿爸真好"] },
  { name: "晨光盼望", songs: ["城門與晨光", "晨光裡敬拜", "光中歡唱", "光中歡呼", "向光而歌", "亮光進來了", "起來歌唱", "重生綻放", "因祢我敢夢"] },
  { name: "安靜親近", songs: ["安靜等候", "靠近祢心", "向祢奔跑", "抬起我的眼", "回應祢的愛", "修補我心", "縫好的心", "把我抱緊"] },
  { name: "榮耀敬拜", songs: ["榮耀在這裡", "榮耀直到永遠", "歡呼榮耀歸給祢", "榮耀在此刻", "回到祢榮耀裡", "回應祢榮耀"] }
];

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

/* 新歌請加在最上面。id 是 YouTube 網址中 v= 後面那一段。 */
window.SONGS = [
  { id: "jpCHNsmz8-M", zh: "你永遠掌權", en: "You Reign Forever", time: "3:03" },
  { id: "N8M0rtN5oOM", zh: "你真好", en: "You Are So Good", time: "4:09" },
  { id: "-yZ0StOX6b0", zh: "祢是我的喜樂", en: "You Are My Joy", time: "3:56" },
  { id: "RSK6W4HDuAE", zh: "我要歡呼", en: "I Will Shout for Joy", time: "3:49" },
  { id: "3LFW4j3MyN4", zh: "祢配得最高讚美", en: "Worthy of Highest Praise", time: "4:07" },
  { id: "i5X74PRLukk", zh: "讚美不停息", en: "Unstoppable Praise", time: "4:30" },
  { id: "gfewcMcrVqk", zh: "城門與晨光", en: "City Gates and Morning Light", time: "4:15" },
  { id: "pgVvkQLkqOI", zh: "高舉你的名", en: "Lift Your Name High", time: "3:11" },
  { id: "shBP0xioo04", zh: "重生綻放", en: "Born Again and Bloom", time: "4:24" },
  { id: "zpXppYBNRNA", zh: "向祢奔跑", en: "Running to You", time: "3:35" },
  { id: "U3ObfULFAGE", zh: "同來敬拜", en: "Come and Worship", time: "4:30" },
  { id: "lmM229NckEc", zh: "安靜等候", en: "Waiting in Silence", time: "4:14" },
  { id: "13-sH0zVyvA", zh: "歡呼的心", en: "Rejoicing Heart", time: "3:45" },
  { id: "5qTH6eZJ5_I", zh: "主祢真好", en: "You Are So Good", time: "4:00" },
  { id: "giz7Q1BbCbM", zh: "同聲讚美", en: "Praise with One Voice", time: "3:56" },
  { id: "6hSo8JCQDVg", zh: "高聲敬拜", en: "Loudly Worship", time: "3:46" },
  { id: "g3zky95wOE0", zh: "歡呼同在", en: "Rejoice in Your Presence", time: "4:10" },
  { id: "t3MdXKZpD4Q", zh: "晨光裡敬拜", en: "Worship in the Morning Light", time: "4:31" },
  { id: "plsgglbj4Vg", zh: "抬起我的眼", en: "Lift Up My Eyes", time: "4:09" },
  { id: "D1xi5mhIsos", zh: "光中歡唱", en: "Sing in the Light", time: "3:03" },
  { id: "jJ3IQYbh2lU", zh: "靠近祢心", en: "Close to Your Heart", time: "4:50" },
  { id: "8TwWEQGk25o", zh: "光中歡呼", en: "Shout in the Light", time: "3:42" },
  { id: "X_g3q1ll9W8", zh: "修補我心", en: "Mend My Heart", time: "4:47" },
  { id: "7TeQ7gd2L44", zh: "把我抱緊", en: "Hold Me Tight", time: "4:43" },
  { id: "mtx4GEKiswY", zh: "縫好的心", en: "Perfectly Healed", time: "4:56" },
  { id: "ZqZOuxGTnTc", zh: "你是良善", en: "You Are Good", time: "3:38" },
  { id: "vQ8UkmlyhM4", zh: "把手舉起來", en: "Raise Your Hands", time: "3:45" },
  { id: "f85yUW-uMD4", zh: "向光而歌", en: "Sing to the Light", time: "4:38" },
  { id: "3VGtasSwXrE", zh: "主你真美好", en: "You Are So Good, Lord", time: "4:00" },
  { id: "Zt9Jpf7MZCI", zh: "起來歌唱", en: "Rise and Sing", time: "4:36" },
  { id: "VB7zCT0ajqY", zh: "亮光進來了", en: "Light Has Come In", time: "4:05" },
  { id: "pby99U2Oko0", zh: "阿爸真好", en: "Papa is so Good", time: "3:39" },
  { id: "_XkttNghA-A", zh: "回應祢的愛", en: "Respond to Your Love", time: "5:13" },
  { id: "o_w5rXQiww0", zh: "因祢我敢夢", en: "Dare to Dream Because of You", time: "3:58" },
  { id: "rR_rLQiuKIs", zh: "同行的喜樂", en: "Joy of Journeying Together", time: "3:26" },
  { id: "JNpP5u42XDI", zh: "回應祢榮耀", en: "Respond to Your Glory", time: "4:40" },
  { id: "e9vrArRN_0I", zh: "一起唱哈利路亞", en: "Hallelujah Together", time: "3:48" },
  { id: "HLVY-4kOSXE", zh: "榮耀在這裡", en: "Glory Is Here", time: "5:05" },
  { id: "X2LutIva644", zh: "榮耀直到永遠", en: "Glory Forever", time: "4:31" },
  { id: "vwtlUBBqGaA", zh: "恩典一路唱", en: "Grace All the Way", time: "4:12" },
  { id: "Ch_szulhUN0", zh: "永不止息的讚美", en: "Never-Ending Praise", time: "4:34" },
  { id: "c_pu_9JQfpI", zh: "歡呼榮耀歸給祢", en: "Glory to You", time: "3:42" },
  { id: "1q7wLm17kkY", zh: "榮耀在此刻", en: "Glory Right Now", time: "4:14" },
  { id: "tfwYGEjRaGE", zh: "回到祢榮耀裡", en: "Back to Your Glory", time: "5:33" }
];
