import { Application,Router } from "https://deno.land/x/oak/mod.ts";
import { viewEngine, dejsEngine, oakAdapter } from "https://deno.land/x/view_engine/mod.ts"
import staticFiles from "https://deno.land/x/static_files/mod.ts";
import { YamlLoader } from "https://deno.land/x/yaml_loader/mod.ts";
import { CookieJar } from "https://deno.land/x/cookies/mod.ts";
import {FanzaAPI} from "https://deno.land/x/fanzaapi@0.0.9/mod.ts";

const yamlLoader = new YamlLoader();
const conf = await yamlLoader.parseFile("./config/default.yml");
const serverData = await yamlLoader.parseFile("./config/server.yml");

const app = new Application();
const router = new Router();

app.use(
    viewEngine(oakAdapter, dejsEngine, {
        viewRoot: './views/',
    })
);
app.use(staticFiles('assets'));

var api = {
    apiid: 'bNKvmKPuTDunaEwC6GAP',
    affiliateid: 'utamita-992'
}
var fanza = new FanzaAPI(api);

router
    .get('/', async (context, next) => {
        //ホーム
        const dt = new Date();
        const jdt = new Date(dt.getTime() + 9 * 60 * 60 * 1000);
        const isoStr = jdt.toISOString().split('Z')[0];
        var cookies = new CookieJar(context.request, context.response);
        switch(cookies.get("agecheck")){
            case 'yes':
                var sort: string = context.request.url.searchParams.get('sort');
                if(sort == undefined){
                    sort = 'rank';
                }
                var requestOptions: string[] = {
                    site:'FANZA',
                    service:'digital',
                    floor:'videoc',
                    article:'genre',
                    article_id:'1018',
                    sort:sort,
                    hits:40,
                    offset:1,
                    lte_date:isoStr.slice( 0, 19 ),
                }
                var data: string[] = await fanza.ItemList(requestOptions);
                var hits: number = data.result.result_count;
                var count: number = data.result.total_count;
                var max_page: number = Math.ceil(count / hits);
                var page: number;
                if(context.request.url.searchParams.get('page') !== null){
                    page = context.request.url.searchParams.get('page');
                }else{
                    page = 1;
                }
                if(page <= max_page){
                    var offset: number = ((page - 1)*40) + 1;
                    var requestOptions2: string[] = {
                        site:'FANZA',
                        service:'digital',
                        floor:'videoc',
                        article:'genre',
                        article_id:'1018',
                        sort:sort,
                        hits:40,
                        offset:offset,
                        lte_date:isoStr.slice( 0, 19 ),
                    }
                    var data2: string[] = await fanza.ItemList(requestOptions2);
                    context.render("index.ejs",
                    {
                        videos: data2.result,
                        max_page: max_page,
                        page:page,
                        query:'',
                        sort:sort,
                        conf:conf,
                        serverData:serverData
                    });
                }
                break;
            default:
                context.render('age.ejs', { conf: conf } );
                break;
        }
    })
    .get('/search', async (context, next) => {
        //動画検索
        const dt = new Date();
        const jdt = new Date(dt.getTime() + 9 * 60 * 60 * 1000);
        const isoStr = jdt.toISOString().split('Z')[0];
        var cookies = new CookieJar(context.request, context.response);
        switch(cookies.get("agecheck")){
            case 'yes':
                if(context.request.url.searchParams.get('q') !== null){
                    var sort: string = context.request.url.searchParams.get('sort');
                    if(sort == undefined){
                        sort = 'rank';
                    }
                    var requestOptions: string[] = {
                        site:'FANZA',
                        service:'digital',
                        floor:'videoc',
                        article:'genre',
                        article_id:'1018',
                        sort:sort,
                        hits:40,
                        offset:1,
                        lte_date:isoStr.slice( 0, 19 ),
                        keyword:encodeURI(context.request.url.searchParams.get('q'))
                    }
                    var data: string[] = await fanza.ItemList(requestOptions);
                    var hits: number = data.result.result_count;
                    var count: number = data.result.total_count;
                    var max_page: number = Math.ceil(count / hits);
                    var page: number;
                    if(context.request.url.searchParams.get('page') !== null){
                        page = context.request.url.searchParams.get('page');
                    }else{
                        page = 1;
                    }
                    if(page <= max_page){
                        var offset: number = ((page - 1)*40) + 1;
                        var requestOptions2: string[] = {
                            site:'FANZA',
                            service:'digital',
                            floor:'videoc',
                            article:'genre',
                            article_id:'1018',
                            sort:sort,
                            hits:40,
                            offset:offset,
                            lte_date:isoStr.slice( 0, 19 ),
                            keyword:encodeURI(context.request.url.searchParams.get('q'))
                        }
                        var data2: string[] = await fanza.ItemList(requestOptions2);
                        context.render('search.ejs',
                            {
                                videos: data2.result,
                                max_page: max_page,
                                page:page,
                                query:context.request.url.searchParams.get('q'),
                                sort:sort,
                                conf:conf,
                                serverData:serverData
                            }
                        );
                    }
                }else{
                    context.response.redirect("/");
                }
                break;
            default:
                context.render('age.ejs', { conf: conf } );
                break;
        }
    })
    .get('/watch/:id', async (context) => {
        //動画視聴
        var date = new Date();
        var datetime = date.getTime();
        var requestOptions: string[] = {
            site:'FANZA',
            service:'digital',
            cid:context.params.id
        }
        var data: string[] = await fanza.ItemList(requestOptions);
        var url: string = data.result.items[0].URL;
        var mp4: string = await fanza.getMp4URL(context.params.id);
        var desc: string = await fanza.getDescription(url);
        var sampleImg: string[] = await fanza.getSampleImage(url);
        context.render('watch.ejs',{
            video:data.result,
            datetime:datetime,
            query:"",
            conf:conf,
            serverData:serverData,
            mp4:mp4,
            type:'mp4',
            desc:desc,
            sampleImg:sampleImg
        })
    })
    .get('/player/:id', async (context, next) => {
        //プレイヤー
        var date = new Date();
        var datetime = date.getTime();
        var requestOptions: string[] = {
            site:'FANZA',
            service:'digital',
            cid:context.params.id
        }
        var data: string[] = await fanza.ItemList(requestOptions);
        var mp4: string = await fanza.getMp4URL(data.result.items[0].product_id);
        context.render('player.ejs',{
            video:data.result,
            mp4:mp4,
            conf:conf,
            serverData:serverData
        })
    })
    .get('/maker/:id', async (context, next) => {
        //メーカー
        const dt = new Date();
        const jdt = new Date(dt.getTime() + 9 * 60 * 60 * 1000);
        const isoStr = jdt.toISOString().split('Z')[0];
        var cookies = new CookieJar(context.request, context.response);
        switch(cookies.get("agecheck")){
            case 'yes':
                var sort: string = context.request.url.searchParams.get('sort');
                if(sort == undefined){
                    sort = 'rank';
                }
                var requestOptions: string[] = {
                    site:'FANZA',
                    service:'digital',
                    floor:'videoc',
                    article:'maker',
                    article_id:context.params.id,
                    sort:sort,
                    hits:40,
                    offset:1,
                    lte_date:isoStr.slice( 0, 19 )
                }
                var data: string[] = await fanza.ItemList(requestOptions);
                var hits: number = data.result.result_count;
                var count: number = data.result.total_count;
                var max_page: number = Math.ceil(count / hits);
                var page:number;
                if(context.request.url.searchParams.get('page') !== null){
                    page = context.request.url.searchParams.get('page');
                }else{
                    page = 1;
                }
                if(page <= max_page){
                    var offset: number = ((page - 1)*40) + 1;
                    var requestOptions2: string[] = {
                        site:'FANZA',
                        service:'digital',
                        floor:'videoc',
                        article:'maker',
                        article_id:context.params.id,
                        sort:sort,
                        hits:40,
                        offset:offset,
                        lte_date:isoStr.slice( 0, 19 )
                    }
                    var data2: string[] = await fanza.ItemList(requestOptions2);
                    context.render('maker.ejs',
                        {
                            videos: data2.result,
                            max_page: max_page,
                            page:page,
                            query:'',
                            sort:sort,
                            conf:conf,
                            serverData:serverData,
                            makerid:data2.result.items[0].iteminfo.maker[0].id
                        }
                    )
                }
                break;
            default:
                context.render('age.ejs', { conf: conf } );
                break;
        }
    })
    .get('/category/:category', async (context, next) => {
        //カテゴリ
        const dt = new Date();
        const jdt = new Date(dt.getTime() + 9 * 60 * 60 * 1000);
        const isoStr = jdt.toISOString().split('Z')[0];
        var cookies = new CookieJar(context.request, context.response);
        switch(cookies.get("agecheck")){
            case 'yes':
                var sort: string = context.request.url.searchParams.get('sort');
                if(sort == undefined){
                    sort = 'rank';
                }
                var requestOptions: string[] = {
                    site:'FANZA',
                    service:'digital',
                    floor:'videoc',
                    article:'genre',
                    article_id:'1018',
                    sort:sort,
                    hits:40,
                    offset:1,
                    lte_date:isoStr.slice( 0, 19 ),
                    keyword:encodeURI(context.params.category)
                }
                var data: string[] = await fanza.ItemList(requestOptions);
                var hits: number = data.result.result_count;
                var count: number = data.result.total_count;
                var max_page: number = Math.ceil(count / hits);
                var page:number;
                if(context.request.url.searchParams.get('page') !== null){
                    page = context.request.url.searchParams.get('page');
                }else{
                    page = 1;
                }
                if(page <= max_page){
                    var offset: number = ((page - 1)*40) + 1;
                    var requestOptions2: string[] = {
                        site:'FANZA',
                        service:'digital',
                        floor:'videoc',
                        article:'genre',
                        article_id:'1018',
                        sort:sort,
                        hits:40,
                        offset:offset,
                        lte_date:isoStr.slice( 0, 19 ),
                        keyword:encodeURI(context.params.category)
                    }
                    var data2: string[] = await fanza.ItemList(requestOptions2);
                    context.render('category.ejs',
                        {
                            videos: data2.result,
                            max_page: max_page,
                            page:page,
                            query:'',
                            sort:sort,
                            conf:conf,
                            serverData:serverData,
                            category:context.params.category
                        }
                    );
                }
                break;
            default:
                context.render('age.ejs', { conf: conf } );
                break;
        }
    })

//router
app.use(router.routes());
app.use(router.allowedMethods());

//port 8000 listen
await app.listen({ port: 8000 });