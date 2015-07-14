(function(){var b=YAHOO.util.Dom,z=YAHOO.util.Event,s=YAHOO.util.Element;var t=Alfresco.util.encodeHTML;Alfresco.DiscussionsTopicList=function(A){this.name="Alfresco.DiscussionsTopicList";this.id=A;this.currentFilter={};this.widgets={};this.tagId={id:0,tags:{}};Alfresco.util.ComponentManager.register(this);Alfresco.util.YUILoaderHelper.require(["button","dom","datasource","datatable","paginator","event","element"],this.onComponentsLoaded,this);YAHOO.Bubbling.on("tagSelected",this.onTagSelected,this);YAHOO.Bubbling.on("changeFilter",this.onChangeFilter,this);YAHOO.Bubbling.on("topiclistRefresh",this.onDiscussionsTopicListRefresh,this);YAHOO.Bubbling.on("deactivateAllControls",this.onDeactivateAllControls,this);return this};Alfresco.DiscussionsTopicList.prototype={options:{siteId:"",containerId:"discussions",initialFilter:{},pageSize:10,simpleView:false,maxContentLength:512},currentFilter:null,widgets:null,tagId:null,busy:false,recordOffset:0,totalRecords:0,setOptions:function f(A){this.options=YAHOO.lang.merge(this.options,A);return this},setMessages:function l(A){Alfresco.util.addMessages(A,this.name);return this},onComponentsLoaded:function m(){z.onContentReady(this.id,this.onReady,this,true)},onReady:function w(){var L=this;this.widgets.simpleView=Alfresco.util.createYUIButton(this,"simpleView-button",this.onSimpleView);var D=function A(R,Q){L.widgets.paginator.setState(R);L._updateDiscussionsTopicList({page:R.page})};this.widgets.paginator=new YAHOO.widget.Paginator({containers:[this.id+"-paginator"],rowsPerPage:this.options.pageSize,initialPage:1,template:this._msg("pagination.template"),pageReportTemplate:this._msg("pagination.template.page-report"),previousPageLinkLabel:this._msg("pagination.previousPageLinkLabel"),nextPageLinkLabel:this._msg("pagination.nextPageLinkLabel")});this.widgets.paginator.subscribe("changeRequest",D,this);var M=function J(S,R){var Q=YAHOO.Bubbling.getOwnerByTagName(R[1].anchor,"div");if(Q!==null){var T=Q.className;var U=R[1].target;if(typeof L[T]=="function"){L[T].call(L,U.offsetParent,Q);R[1].stop=true}}return true};YAHOO.Bubbling.addDefaultAction("topic-action-link-div",M);var I=function B(S,R){var Q=YAHOO.Bubbling.getOwnerByTagName(R[1].anchor,"span");if(Q!==null){var T=Q.className;var U=R[1].target;if(typeof L[T]=="function"){L[T].call(L,U.offsetParent,Q);R[1].stop=true}}return true};YAHOO.Bubbling.addDefaultAction("topic-action-link-span",I);Alfresco.util.tags.registerTagActionHandler(this);var C=YAHOO.lang.substitute(Alfresco.constants.URL_SERVICECONTEXT+"components/forum/site/{site}/{container}/posts",{site:this.options.siteId,container:this.options.containerId});this.widgets.dataSource=new YAHOO.util.DataSource(C,{responseType:YAHOO.util.DataSource.TYPE_JSON,connXhrMode:"queueRequests",responseSchema:{resultsList:"items",metaFields:{recordOffset:"startIndex",totalRecords:"total",forumPermissions:"forumPermissions"}}});var P=function(S,T,R){var Q="";Q+='<div class="nodeEdit">';Q+="<"+R+' class="onViewTopic"><a href="#" class="topic-action-link-'+R+'">'+S._msg("action.view")+"</a></"+R+">";if(T.permissions.edit){Q+="<"+R+' class="onEditTopic"><a href="#" class="topic-action-link-'+R+'">'+S._msg("action.edit")+"</a></"+R+">"}if(T.permissions["delete"]){Q+="<"+R+' class="onDeleteTopic"><a href="#" class="topic-action-link-'+R+'">'+S._msg("action.delete")+"</a></"+R+">"}Q+="</div>";return Q};var F=function O(Y,Z,W,Q){b.addClass(Y,"hidden");var U=Z.getData();var S=Alfresco.util.discussions.getTopicViewPage(L.options.siteId,L.options.containerId,U.name);var R=Alfresco.util.people.generateUserLink(U.author);var V="";if(!L.options.simpleView){V+='<div class="node topic">';V+=P(L,U,"div");V+='<div class="nodeContent">';V+='<span class="nodeTitle"><a href="'+S+'">'+t(U.title)+"</a> ";if(U.isUpdated){V+='<span class="theme-color-2 nodeStatus">('+L._msg("post.updated")+")</span>"}V+="</span>";V+='<div class="published">';V+='<span class="nodeAttrLabel">'+L._msg("post.createdOn")+": </span>";V+='<span class="nodeAttrValue">'+Alfresco.util.formatDate(U.createdOn)+"</span>";V+='<span class="separator">&nbsp;</span>';V+='<span class="nodeAttrLabel">'+L._msg("post.author")+": </span>";V+='<span class="nodeAttrValue">'+R+"</span>";V+="<br />";if(U.lastReplyBy){V+='<span class="nodeAttrLabel">'+L._msg("post.lastReplyBy")+": </span>";V+='<span class="nodeAttrValue">'+Alfresco.util.people.generateUserLink(U.lastReplyBy)+"</span>";V+='<span class="separator">&nbsp;</span>';V+='<span class="nodeAttrLabel">'+L._msg("post.lastReplyOn")+": </span>";V+='<span class="nodeAttrValue">'+Alfresco.util.formatDate(U.lastReplyOn)+"</span>"}else{V+='<span class="nodeAttrLabel">'+L._msg("replies.label")+": </span>";V+='<span class="nodeAttrValue">'+L._msg("replies.noReplies")+"</span>"}V+="</div>";V+='<div class="userLink">'+R+" "+L._msg("said")+":</div>";V+='<div class="content yuieditor"></div>';V+="</div>";V+="</div>";V+='<div class="nodeFooter">';V+='<span class="nodeAttrLabel replyTo">'+L._msg("replies.label")+": </span>";V+='<span class="nodeAttrValue">('+U.totalReplyCount+")</span>";V+='<span class="separator">&nbsp;</span>';V+='<span class="nodeAttrValue"><a href="'+S+'">'+L._msg("action.read")+"</a></span>";V+='<span class="separator">&nbsp;</span>';V+='<span class="nodeAttrLabel tagLabel">'+L._msg("label.tags")+": </span>";if(U.tags.length>0){for(var X=0;X<U.tags.length;X++){if(X>0){V+=", "}V+=Alfresco.util.tags.generateTagLink(L,U.tags[X])}}else{V+='<span class="nodeAttrValue">'+L._msg("tags.noTags")+"</span>"}V+="</div></div>"}else{b.addClass(Y,"row-separator");V+='<div class="node topic simple">';V+=P(L,U,"span");V+='<div class="nodeContent">';V+='<span class="nodeTitle"><a href="'+S+'">'+t(U.title)+"</a> ";if(U.isUpdated){V+='<span class="theme-color-2 nodeStatus">('+L._msg("post.updated")+")</span>"}V+='<div class="published">';V+='<span class="nodeAttrLabel">'+L._msg("post.createdOn")+": </span>";V+='<span class="nodeAttrValue">'+Alfresco.util.formatDate(U.createdOn)+"</span>";V+='<span class="separator">&nbsp;</span>';V+='<span class="nodeAttrLabel">'+L._msg("post.author")+": </span>";V+='<span class="nodeAttrValue">'+R+"</span>";V+="</div>";V+="</div>";V+="</div>"}Y.innerHTML=V;if(!L.options.simpleView){var T=b.getElementsByClassName("content","div",Y);if(T.length==1){T[0].innerHTML=U.content}}b.removeClass(Y,"hidden")};var G=[{key:"topics",label:"Topics",sortable:false,formatter:F}];this.widgets.dataTable=new YAHOO.widget.DataTable(this.id+"-topiclist",G,this.widgets.dataSource,{initialLoad:false,dynamicData:true,MSG_EMPTY:this._msg("message.loading")});this.widgets.dataTable.handleDataReturnPayload=function H(R,Q,S){L.recordOffset=Q.meta.recordOffset;L.totalRecords=Q.meta.totalRecords;S=S||{};S.recordOffset=Q.meta.recordOffset;S.totalRecords=Q.meta.totalRecords;return S};this.widgets.dataTable.doBeforePaginatorChange=function N(Q){return false};this.widgets.dataTable.subscribe("renderEvent",function(){this.widgets.paginator.setState({recordOffset:this.recordOffset,totalRecords:this.totalRecords});this.widgets.paginator.render()},this,true);this._setDefaultDataTableErrors(this.widgets.dataTable);this.widgets.dataTable.subscribe("tableMsgShowEvent",function(Q){this._elMsgTbody.parentNode.style.width=""});this.widgets.dataTable.doBeforeLoadData=function K(R,S,U){if(S.error){try{var Q=YAHOO.lang.JSON.parse(S.responseText);L.widgets.dataTable.set("MSG_ERROR",Q.message)}catch(T){L._setDefaultDataTableErrors(L.widgets.dataTable)}}else{if(S.results&&!L.options.usePagination){this.renderLoopSize=Alfresco.util.RENDERLOOPSIZE}}return true};this.widgets.dataTable.subscribe("rowMouseoverEvent",this.onEventHighlightRow,this,true);this.widgets.dataTable.subscribe("rowMouseoutEvent",this.onEventUnhighlightRow,this,true);var E=YAHOO.lang.merge({filterId:"new",filterOwner:"Alfresco.DiscussionsTopicListFilter",filterData:null},this.options.initialFilter);YAHOO.Bubbling.fire("changeFilter",E)},onSimpleView:function r(A,B){this.options.simpleView=!this.options.simpleView;B.set("label",this._msg(this.options.simpleView?"header.detailList":"header.simpleList"));YAHOO.Bubbling.fire("topiclistRefresh");z.preventDefault(A)},onViewTopic:function q(B){var A=this.widgets.dataTable.getRecord(B);window.location=Alfresco.util.discussions.getTopicViewPage(this.options.siteId,this.options.containerId,A.getData("name"))},onEditTopic:function i(C){var A=this.widgets.dataTable.getRecord(C);var B=YAHOO.lang.substitute(Alfresco.constants.URL_PAGECONTEXT+"site/{site}/discussions-createtopic?topicId={topicId}",{site:this.options.siteId,topicId:A.getData("name")});window.location=B},onTagSelected:function u(B,A){var C=A[1];if(C&&(C.tagName!==null)){var D={filterId:C.tagName,filterOwner:"Alfresco.TagFilter",filterData:null};YAHOO.Bubbling.fire("changeFilter",D)}},onDeleteTopic:function o(E){var B=this.widgets.dataTable.getRecord(E);var C=this;Alfresco.util.PopupManager.displayPrompt({title:this._msg("message.confirm.delete.title"),text:this._msg("message.confirm.delete",t(B.getData("title"))),buttons:[{text:this._msg("button.delete"),handler:function A(){this.destroy();C._deleteTopicConfirm.call(C,B.getData("name"))}},{text:this._msg("button.cancel"),handler:function D(){this.destroy()},isDefault:true}]})},_deleteTopicConfirm:function v(D){if(!this._setBusy(this._msg("message.wait"))){return}var A=function C(E){this._releaseBusy();this._updateDiscussionsTopicList()};var B=YAHOO.lang.substitute(Alfresco.constants.PROXY_URI+"api/forum/post/site/{site}/{container}/{topicId}?page=discussions-topicview",{site:this.options.siteId,container:this.options.containerId,topicId:encodeURIComponent(D)});Alfresco.util.Ajax.request({url:B,method:"DELETE",responseContentType:"application/json",successMessage:this._msg("message.delete.success"),successCallback:{fn:A,scope:this},failureMessage:this._msg("message.delete.failure"),failureCallback:{fn:function(E){this._releaseBusy()},scope:this}})},onEventHighlightRow:function n(D){var A=this.widgets.dataTable.getRecord(D.target.id);if(A){var B=A.getData("permissions");if(!(B.edit||B["delete"])){return}}var C=b.getElementsByClassName("topic",null,D.target,null);b.addClass(C,"over")},onEventUnhighlightRow:function p(B){var A=b.getElementsByClassName("topic",null,B.target,null);b.removeClass(A,"over")},onChangeFilter:function d(B,A){var C=A[1];if((C!==null)&&(C.filterId!==null)){this.currentFilter={filterId:C.filterId,filterOwner:C.filterOwner,filterData:C.filterData};this._updateDiscussionsTopicList({page:1});YAHOO.Bubbling.fire("filterChanged",this.currentFilter)}},onDeactivateAllControls:function a(C,B){var A,D,E=Alfresco.util.disableYUIButton;for(A in this.widgets){if(this.widgets.hasOwnProperty(A)){E(this.widgets[A])}}},updateListTitle:function h(){var C=b.get(this.id+"-listtitle"),E=this._msg("title.generic"),B=this.currentFilter.filterOwner,A=this.currentFilter.filterId,D=this.currentFilter.filterData;if(B=="Alfresco.TopicListFilter"){if(A=="new"){E=this._msg("title.newtopics")}if(A=="hot"){E=this._msg("title.hottopics")}else{if(A=="all"){E=this._msg("title.alltopics")}else{if(A=="mine"){E=this._msg("title.mytopics")}}}}else{if(B=="Alfresco.TagFilter"){E=this._msg("title.bytag",t(D))}}C.innerHTML=E},onDiscussionsTopicListRefresh:function k(B,A){this._updateDiscussionsTopicList({})},_setBusy:function g(A){if(this.busy){return false}this.busy=true;this.widgets.busyMessage=Alfresco.util.PopupManager.displayMessage({text:A,spanClass:"wait",displayTime:0});return true},_releaseBusy:function x(){if(this.busy){if(this.widgets.busyMessage.destroyWithAnimationsStop!=undefined){this.widgets.busyMessage.destroyWithAnimationsStop()}else{this.widgets.busyMessage.destroy()}this.busy=false;return true}else{return false}},_msg:function j(A){return Alfresco.util.message.call(this,A,"Alfresco.DiscussionsTopicList",Array.prototype.slice.call(arguments).slice(1))},_setDefaultDataTableErrors:function e(A){var B=Alfresco.util.message;A.set("MSG_EMPTY",B("message.empty","Alfresco.DiscussionsTopicList"));A.set("MSG_ERROR",B("message.error","Alfresco.DiscussionsTopicList"))},_updateDiscussionsTopicList:function c(E){this._setDefaultDataTableErrors(this.widgets.dataTable);var B=function D(F,G,H){this.widgets.dataTable.onDataReturnInitializeTable.call(this.widgets.dataTable,F,G,H);this.updateListTitle()};var C=function A(G,H){if(H.status==401){window.location.reload(true)}else{try{var F=YAHOO.lang.JSON.parse(H.responseText);this.widgets.dataTable.set("MSG_ERROR",F.message);this.widgets.dataTable.showTableMessage(F.message,YAHOO.widget.DataTable.CLASS_ERROR);if(H.status==404){YAHOO.Bubbling.fire("deactivateAllControls")}}catch(I){this._setDefaultDataTableErrors(this.widgets.dataTable)}}};this.widgets.dataSource.sendRequest(this._buildParams(E||{}),{success:B,failure:C,scope:this})},_buildParams:function y(G){var F={contentLength:this.options.maxContentLength,tag:null,page:this.widgets.paginator.getCurrentPage()||"1",pageSize:this.widgets.paginator.getRowsPerPage()};if(typeof G=="object"){F=YAHOO.lang.merge(F,G)}F.startIndex=(F.page-1)*F.pageSize;var C=this.currentFilter.filterOwner;var A=this.currentFilter.filterId;var E=this.currentFilter.filterData;var B="";if(C=="Alfresco.TopicListFilter"){if(A=="all"){B=""}if(A=="new"){B="/new"}else{if(A=="hot"){B="/hot"}else{if(A=="mine"){B="/myposts"}}}}else{if(C=="Alfresco.TagFilter"){F.tag=encodeURIComponent(E)}}var D="";for(paramName in F){if(F[paramName]!==null){D+="&"+paramName+"="+encodeURIComponent(F[paramName])}}if(D.length>0){D=D.substring(1)}return B+"?"+D}}})();