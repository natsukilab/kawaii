# KAWAII
KAWAII is an adult affiliate site using DMM web service.

Build environments are Deno, oak, view_engine and dejs.

We are developing an affiliate template that anyone can use immediately.

# Usage
```sh
git clone https://github.com/natsukilab/kawaii.git
cd kawaii
cp config/example.yml config/default.yml
nano config/default.yml
```
```yaml
app:
    url: 'https://example.com/' #Your URL
    name: 'KAWAII' #Your app name
#FANZA API access information
api:
    apiid: '' #Your ApiID
    affiliateid: '' #Your AffiliateID
```
```sh
deno run --allow-net --allow-read app.ts
```

# deno-fanzaapi
I created a package for using FANZA's DMM web service in the Deno environment.
https://deno.land/x/fanzaapi
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
