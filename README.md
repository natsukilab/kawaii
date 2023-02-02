# kawaii
kawaiiはDMMウェブサービスを利用したアダルトアフィリエイトサイトです。

構築環境は Deno + oak + view_engine + dejs です。

# deno-fanzaapi
Deno環境でFANZAのDMMウェブサービスを利用するためのパッケージを作成しました。
https://deno.land/x/fanzaapi@0.0.6
```js
import {FanzaAPI} from "https://deno.land/x/fanzaapi/mod.ts";
var api = {
    apiid: '',
    affiliateid: ''
}
var fanza = new FanzaAPI(api);
var requestOptions = {
    site:'FANZA',
    service:'digital',
    floor:'videoc',
    article:'genre',
    article_id:'1018'
}
var data: string[] = await fanza.ItemList(requestOptions);
```
