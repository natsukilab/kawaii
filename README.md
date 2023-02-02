# kawaii
kawaiiはDMMウェブサービスを利用したアダルトアフィリエイトサイトです。

構築環境は Deno + oak + view_engine + dejs です。

![Fn77Lf6akAA5Uz1](https://user-images.githubusercontent.com/79701376/216239253-54b6773f-8462-4815-9ca5-c48e2f4f2e3b.jpg)

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
