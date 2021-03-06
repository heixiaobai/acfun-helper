/**
 * 评论区增强 1.用户标记 2.up主评论显示【up主】标记 3.在评论区添加快速跳转至视频对应时间的链接
 */
class CommentEnhance{
    constructor() {

    }

    //从个人中心评论跳转到对应的楼层,不完善(折叠中和非第一页的无法跳转)
    async jumpToComment(){
        let msg_comment = REG.msg_comment;
        let res = msg_comment.exec(href);
        if(res!=null && res!=undefined && res.length==4){
            let cid = res[3];
            let retry = 10;
            while (retry>0){
                let node = $('div[data-commentid='+cid+']').eq(0);
                let node_offset = node.offset();
                if(node_offset!=undefined && node_offset!=null){
                    let top = Number(node_offset.top)-Number(node.height());
                    $("html, body").animate({
                        scrollTop: top
                    }, {
                        duration: 500,
                        easing: "swing"
                    });
                    break;
                }else{
                    await mysleep(1000);
                }
                retry--;
            }
        }
    }

    //-------------------------------------------评论区标记功能-----------------------------------------------------------------------

    //渲染扫描到的用户tag信息
    renderScan(){
        var timer = setInterval(function () {
            let nodes = $('.area-comment-title a.name');
            let loading = $('.ac-comment-loading').html();
            if(nodes.length>0 && loading==''){
                nodes.each(async function () {
                    let exists = $(this).parent().find('.pos.simple');
                    if(exists.length==0){
                        let userId = $(this).data('userid');
                        let userName = $(this).text();
                        let tagInfo = await getStorage("AC_"+userId).then(res=>{return res["AC_"+userId]});
                        if(tagInfo!=undefined &&tagInfo.tag!='' && tagInfo.tag!=undefined){
                            if(userName!=tagInfo.name){
                                $(this).after('<span title="'+tagInfo.name+'" class="pos simple">'+tagInfo.tag+'</span>');
                            }else{
                                $(this).after('<span class="pos simple">'+tagInfo.tag+'</span>');
                            }
                        }
                    }
                });
                clearInterval(timer);
            }
        },1000);
    }



    //渲染标记按钮
    renderMark(){
        var timer = setInterval(function () {
            let nodes = $('.area-comm-more');
            let loading = $('.ac-comment-loading').html();
            if(nodes.length>0 && loading == ''){
                nodes.each(function(){
                    let text = $(this).text();
                    if(text.indexOf('标记')==-1){
                        $(this).addClass('comment-mark-parent');
                        $(this).append('<span class="comment-mark">标记</span>');
                        $(this).on('click','.comment-mark',function () {
                            let userNode = $(this).parent().parent().parent().find('.name').eq(0);
                            let username = userNode.text();
                            let userId = userNode.data("userid");
                            let title = '为『'+username+'』添加标记，最多10个字符';
                            let tag=prompt(title,"");
                            let tag_trim = tag.trim();
                            if(tag_trim!='' && tag_trim!=null && tag_trim.length<=10){
                                let key = "AC_"+userId;
                                let value = {name:username,tag:tag};
                                chrome.storage.local.set({[key]:value}, function () {
                                    userNode.parent().find('.pos.simple').remove();
                                    userNode.after('<span class="pos simple">'+tag+'</span>');
                                });
                            }

                        });
                    }
                });
                clearInterval(timer);
            }
        },1000);
    }


    //评论区显示up主名字
    renderScanForUp(){
        var timer = setInterval(function () {
            var url = window.location.toString();
            let avr = new RegExp("/v/");
            let aar = new RegExp("/a/");
            let av = avr.exec(url);
            let aa=aar.exec(url);
            if(av!=null && av!=undefined && av.length>=1){
                var up=$('a.up-name').text();
            }else if(aa!=null && aa!=undefined && aa.length>=1){
                var up=$('div.up-name a.upname').text();
            }
            let nodes = $('.area-comment-title a.name');
            let loading = $('.ac-comment-loading').html();
            if(nodes.length>0 && loading==''){
                nodes.each(async function () {
                    let exists = $(this).parent().find('.pos.up');
                    if(exists.length==0){
                        let userName = $(this).text();
                        if(userName==up){
                            $(this).after('<span class="pos up">UP主</span>');
                        }
                    }
                });
                clearInterval(timer);
            }
        },1020);
    }



    renderSubScan(rootCommentId){
        var timer = setInterval(function () {
            let nodes = $("div[data-commentid='"+rootCommentId+"']").find('a.name');
            if(nodes.length>0){
                nodes.each(async function () {
                    let exists = $(this).parent().find('.pos.simple');
                    if(exists.length==0){
                        let userId = $(this).data('userid');
                        let userName = $(this).text();
                        let tagInfo = await getStorage("AC_"+userId).then(res=>{return res["AC_"+userId]});
                        if(tagInfo!=undefined &&tagInfo.tag!='' && tagInfo.tag!=undefined){
                            if(userName!=tagInfo.name){
                                $(this).after('<span title="'+tagInfo.name+'" class="pos simple">'+tagInfo.tag+'</span>');
                            }else{
                                $(this).after('<span class="pos simple">'+tagInfo.tag+'</span>');
                            }
                        }
                    }
                });
                clearInterval(timer);
            }
        },1000);
    }


    //评论区(折叠或翻页中)显示up主名字
    renderSubScanForUp(rootCommentId){
        var timer = setInterval(function () {
            let url = window.location.toString();
            let avr = new RegExp("/v/");
            let aar = new RegExp("/a/");
            let av = avr.exec(url);
            let aa=aar.exec(url);
            let up = '';
            if(av!=null && av!=undefined && av.length>=1){
                up=$('a.up-name').text();
            }else if(aa!=null && aa!=undefined && aa.length>=1){
                up=$('div.up-name a.upname').text();
            }
            let nodes = $("div[data-commentid='"+rootCommentId+"']").find('a.name');
            if(nodes.length>0){
                nodes.each(function () {
                    let exists = $(this).parent().find('.pos.up');
                    if(exists.length==0){
                        let userName = $(this).text();
                        if(userName==up){
                            $(this).after('<span class="pos up">UP主</span>');
                        }
                    }
                });
                clearInterval(timer);
            }
        },1020);
    }



    renderSubMark(rootCommentId){
        var timer = setInterval(function () {
            let nodes = $("div[data-commentid='"+rootCommentId+"']").find('.area-comm-more');
            if(nodes.length>0){

                nodes.each(function () {
                    let text = $(this).text();
                    if(text.indexOf('标记')==-1){
                        $(this).addClass('comment-mark-parent');
                        $(this).append('<span class="comment-mark">标记</span>');
                        $(this).on('click','.comment-mark',function () {
                            let userNode = $(this).parent().parent().parent().find('.name').eq(0);
                            let username = userNode.text();
                            let userId = userNode.data("userid");
                            let title = '为『'+username+'』添加标记，最多10个字符';
                            let tag=prompt(title,"");
                            let tag_trim = tag.trim();
                            if(tag_trim!='' && tag_trim!=null && tag_trim.length<=10){
                                let key = "AC_"+userId;
                                let value = {name:username,tag:tag};
                                chrome.storage.local.set({[key]:value}, function () {
                                    userNode.parent().find('.pos.simple').remove();
                                    userNode.after('<span class="pos simple">'+tag+'</span>');

                                });
                            }
                        });
                    }
                });
                clearInterval(timer);
            }
        },1000);
    }

    clearMark(){
        //解绑事件
        $('.area-comm-more').off('click','.comment-mark');
        $(".comment-mark").remove();
        $(".area-comm-more").removeClass('comment-mark-parent');
    }

    clearScan(){
        $(".area-comment-title .pos.simple").remove();
    }


    // 在评论区添加快速跳转至视频对应时间的链接
    searchScanForPlayerTime(){
        var timer = setInterval(function () {
            let nodes = $('.area-comment-des-content');
            let loading = $('.ac-comment-loading').html();
            let reg_for_time=new RegExp('^[0-9].?:[0-9].?');
            let reg_for_mtline=new RegExp('<br>')
            if(nodes.length>0 && loading==''){
                nodes.each(async function () {
                        let comment_content = $(this)[0].innerText.toString();
                        let comment_html = $(this)[0].innerHTML.toString();
                        let if_matchTime=reg_for_time.exec(comment_content);
                        let if_mtline=reg_for_mtline.exec(comment_html);
                        if(if_mtline && if_matchTime){
                            //多行包含了<br>的情况
                            let a=comment_html.split('<br>')
                            after_html_out='';
                            for(let i=0;i<=(a.length-1);i++){
                                let x1=a[i].split(' ');
                                var after_html='';
                                for(let j=0;j<x1.length;j++){
                                    if(reg_for_time.exec(x1[j])){
                                        var after_html=after_html+'<a id=\'quickJump\' onclick=\"quickJump(\''+x1[0]+'\');\">'+x1[0]+'</a>';
                                    }
                                    var after_html=after_html+' '+x1[j];
                                }
                                var after_html_out=after_html_out+after_html+"<br>";
                            }
                            $(this).html(after_html_out);
                        }else{
                            //一行的情况
                            if(if_matchTime){
                                let x=comment_content.split(' ');
                                let y=$(this)[0].innerHTML;
                                let z=y.split(' ');
                                let ie=z.length-1;
                                var after_html='<a id=\'quickJump\' onclick=\"quickJump(\''+x[0]+'\');\">'+x[0]+'</a> ';
                                for(let i=1;i<=ie;i++){
                                    after_html=after_html+z[i]+' ';
                                }
                                $(this).html(after_html);
                            }
                        }
                    }
                );
                clearInterval(timer);
            }
        },1000);

    }

}


