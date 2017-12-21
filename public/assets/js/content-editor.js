/**
 * Created by dinesh on 9/3/16.
 */
/**
 * Jquery Plugin for the content Editor
 */
(function ( $ ) {
    var config = {
        dropZone        : '#ROdropZone',        //DropZone Selector
        templateZone    : '#ROtemplateZone',    //TemplateZone selector
        imagePath       : 'assets/img/content-editor-images/', //image path for the templates
        jsPath          : 'assets/js/',                        //js path
        templatesPath   : 'assets/content-editor-templates/',  //template path
        html            : '', //html to be set in the content editor,
        forms           : []
    };

    //handler content on the side of the template
    var handlerContent  = '<div class="ROhandlers">' +
            '<div class="ROmover" title="Move"><i class="fa fa-arrows"></i></div>' +
            '<button class="ROcloner" title="Clone"><i class="fa fa-plus"></i></button>' +
            '<button class="ROyouTubeHandler hidden" title="Edit Video Link"><i class="fa fa-link"></i></button>' +
            '<button class="ROEditImage hidden" title="Edit Image"><i class="fa fa-camera"></i></button>' +
            '<button class="ROEditImageLink hidden" title="Edit Image Link"><i class="fa fa-pencil"></i></button>' +
            '<button class="ROEditHTML" title="Edit HTML"><i class="fa fa-code" aria-hidden="true"></i></button>' +
            '<button class="ROremover" title="Remove"><i class="fa fa-times"></i></button>' +
            '<button class="ROEditVideo hidden" title="Edit Video"><i class="fa fa-video-camera"></i></button>' +
                            '</div>',
        //image handler content on center of the image
        imageHandlerContent = '<div class="ROimageHandler">' +
                                    '<button class="btn btn-small btn-normal ROuploadImage" ng-click="cvm.openChooseMedia($event,null,null,true)"><i class="fa fa-camera"></i></button>'+
                                    '<button class="btn btn-small btn-normal ROeditImageButton"><i class="fa fa-pencil"></i></button>'+
                                    '<br><button class="btn btn-small btn-normal ROremoveImageButton"><i class="fa fa-close"></i></button>'+
                                '</div>',
        formHandlerContent = '<div class="ROimageHandler ROFormHandler">' +
                                '<button class="btn btn-small btn-normal ROeditFormButton"><i class="fa fa-pencil"></i></button>'+
                            '</div>',
        linkPopUpContent = '<div class="ROimageEditor ROLinkEditor">' +
            '<div class="RO-link-url">' +
            '<lable>Link</lable><input type="text">' +
            '<div class="RO-popup-message RO-popup-message-url"></div>' + //RED-530
            '</div>' +
            '<div class="RO-link-text">' +
                '<lable>Text</lable><input type="text">' +
                '<div class="RO-popup-message RO-popup-message-text"></div>'+
            '</div>' +
            '<div class="ROimgLinkIsNew">' +
            '<lable>Open in New Tab</lable><input type="checkbox">' +
            '</div>' +
            '<div class="ROEditor_btns">' +
            '<button class="btn btn-sm btn-normal ROsavePopUp">Insert</button>' +
            '</div>' +
            '</div>',
	    pageLinkPopUpContent = '<div class="ROimageEditor ROLinkEditor ROPageEditor">' +
		    '<div class="RO-link-selector">'+
			    '<lable>Select Section</lable>' +
			    '<select class="form-control nonUniform">' +
			    '</select>'+
		    '</div>'+
		    '<div class="ROEditor_btns">' +
		        '<button class="btn btn-sm btn-normal ROsavePopUp">Insert</button>' +
		    '</div>' +
		    '</div>',
	    buttonPopUpContent = '<div class="ROimageEditor ROLinkEditor">' +
            '<div class="RO-btn-url">' +
            '<lable>Button Link</lable><input type="text">' +
            '<div class="RO-popup-message RO-popup-message-url"></div>' + //RED-530
            '</div>' +
            '<div class="RO-btn-text">' +
            '<lable>Button Text</lable><input type="text">' +
            '<div class="RO-popup-message RO-popup-message-text"></div>'+
            '</div>' +
            '<div class="ROimgLinkIsNew">' +
            '<lable>Open in New Tab</lable><input type="checkbox">' +
            '</div>' +
            '<div class="ROEditor_btns">' +
	            '<button class="btn btn-sm btn-normal ROsavePopUp ROsaveButton">Insert Button</button>' +
            '</div>' +
            '</div>',
        editHtmlPopUpContent = '<div class="ROimageEditor ROHtmlEditor">' +
            '<div class="RO-link-url">' +
            '<lable>Content : </lable><textarea></textarea>' +
            '<div class="RO-popup-message"></div>' +
            '</div>' +
            '<div class="ROEditor_btns">' +
            '<button class="btn btn-sm btn-normal ROsavePopUp">Edit</button>' +
            '</div>' +
            '</div>',
        formSelectContent = '<div class="ROimageEditor ROFormSelect">'+
                                '<div class="ROselectItem">'+
                                    '<lable>Select Form</lable>' +
                                    '<select class="form-control nonUniform">' +
                                    '</select>'+
                                '</div>'+
                                '<div class="RO-popup-message hidden">Please select form.</div>' +
                                '<div class="ROEditor_btns">'+
                                    '<button class="btn btn-sm btn-normal ROsavePopUp">OK</button>'+
                                    '<button class="btn btn-sm btn-warning ROclosePopUp" style="color: #58666e!important;border-color: #eee3d4;background-color: #fff;">CANCEL</button>' +
                                '</div>'+
                            '</div>',
        //image popup content to change the image data
        imagePopUpContent   = '<div class="ROimageEditor">'+
                                    '<div class="ROimgAltText">'+
	                                    '<span class="red">*</span>'+
                                        '<lable style="width: 124px;">Alt Text</lable><input type="text">'+
                                    '</div>'+
                                    '<div class="ROimgTitle">'+
                                        '<lable>Title</lable><input type="text">'+
                                    '</div>'+
                                    '<div class="ROimgLink">'+
                                        '<lable>Link</lable><input type="text">'+
                                    '</div>'+
                                    '<div class="RO-popup-message"></div>' + //RED-530
                                        '<div class="ROimgLinkIsNew">'+
                                            '<lable>Open in New Tab</lable><input type="checkbox">'+
                                        '</div>'+
                                        '<div class="ROEditor_btns">'+
                                            '<button class="btn btn-sm btn-normal ROsavePopUp">OK</button>'+
                                            '<button class="btn btn-sm btn-warning ROclosePopUp">CANCEL</button>'+
                                        '</div>'+
                                    '</div>',
        //youtube popup content to change the url of the iframe
        youtubePopUpContent     = '<div class="ROyouTubeEditor">'+
                                        '<div class="ROyouTuebeUrl">'+
                                            '<lable>URL :</lable> <input type="text">'+
                                        '</div>'+
                                        '<div class="RO-popup-message"></div>'+
                                        '<div class="RO-old-src hidden"></div>'+
                                        '<div class="ROEditor_btns">'+
                                            '<button class="btn btn-sm btn-normal ROsavePopUp">OK</button>'+
                                            '<button class="btn btn-sm btn-warning ROclosePopUp">CANCEL</button>'+
                                        '</div>'+
                                    '</div>',
        youtubePopUpContentForTwoVideo = '<div class="ROyouTubeEditor ROtwoVideos">'+
                                                '<div class="left">'+
                                                    '<div class="ROyouTuebeUrl">'+
                                                        '<lable>URL1 :</lable> <input type="text">'+
                                                    '</div>'+
                                                    '<div class="RO-popup-message"></div>'+
                                                    '<div class="RO-old-src hidden"></div>'+
                                                '</div>'+
                                                '<div class="right">'+
                                                    '<div class="ROyouTuebeUrl">'+
                                                    '<lable>URL2 :</lable> <input type="text">'+
                                                    '</div>'+
                                                    '<div class="RO-popup-message"></div>'+
                                                    '<div class="RO-old-src hidden"></div>'+
                                                '</div>'+
                                            '<div class="ROEditor_btns">'+
                                                '<button class="btn btn-sm btn-normal ROsavePopUp">OK</button>'+
                                                '<button class="btn btn-sm btn-warning ROclosePopUp">CANCEL</button>'+
                                            '</div>'+
                                            '</div>',
        careerVideoImageContent = '<div class="ROcareerVideoImageContent" style="display: none">' +
	        '<button class="btn btn-small btn-normal" ng-click="cvm.openChooseMediaVideo($event)"><i class="fa fa-eye"></i></button>'+
	                                '</div>',
        $dropZone       =       null,                 //DropZone jQuery Object
        $templateZone   =       null,                 //TemplateZone jQuery Object
        popUpDialog     =       null,                 //Popup Dialog
        currentImage    =       null,                 //store the image temparary to change its data from the popup
        currentYouTubeIframe =  null,                 //current youtube iFrame
        ROtemplate      =        [];                  //Template array for the side bar

    /**
     * @method activate
     * @description first method to be called when the plugin is initiated
     */
    function activate() {
        //populate ROtemplate with the array of the available templates
        ROtemplate = config.templates;
        var $body = $('body');
        $body.addClass('ROeditMode');
        $body.css('overflow-x', '');
        $dropZone = $(config.dropZone);                 //DropZone jQuery Object
        $templateZone = $(config.templateZone);
        var $slideArrow = $('.ROslideArrow');
        //make the container droppable and sortable
        $dropZone
            .droppable({
                accept: '.ROtemplate',
                hoverClass: 'ui-state-hover'
            })
            .sortable({
                axis: 'y',
                handle: '.ROmover',
                placeholder: 'ROplaceHolder row',
                tolerance: 'pointer',
                forcePlaceholderSize: true,
                update: function (event, ui) {
                    if (ui.item.hasClass('ROtemplate')) {
                        insertTemplate(ui.item.find('.ROidContainer').text(), ui.item);
                    }
                }
            });
        addROtemplateToTemplateZone();
        $('.ROtemplate').draggable({
            connectToSortable: config.dropZone,
            scroll: false,
            helper: 'clone',
            revert: 'invalid',
            start: function () {
                removePlaceHolder();
            },
            stop: function () {
                addPlaceHolder();
            }
        });
        //set the slider menu for the template zone
        $slideArrow.off('click');
        $slideArrow.click(function () {
            if ($(this).hasClass('ROshowMenu')) {
                $('.ROslideArrow, #ROtemplateZone,#ROcategory-container').animate({right: '-=243'}, 500);
                $(this).html('&laquo;').addClass('ROhideMenu').removeClass('ROshowMenu');
            } else if ($(this).hasClass('ROhideMenu')) {
                $('.ROslideArrow, #ROtemplateZone,#ROcategory-container').animate({right: '+=243'}, 500);
                $(this).html('&raquo;').addClass('ROshowMenu').removeClass('ROhideMenu');
            }
        });

        //update the name of the form in the content editor
        addFroalaButtons();
        setCategories();
        setHtml(config.html);
        setLinkEditButtonOptions();
        _setUpdatedFormName();

        /**
         * @method _setUpdatedFormName
         * @description function to update the name of the form
         * @private
         * @tickets: BOMB-2029
         */
        function _setUpdatedFormName(){
            var $formContainer = $('.ROtemplateContainer .ROFormContainer');
            var $selectedForm = $formContainer.find('.selectedForm');
            var $emptyMessage = $formContainer.find('.emptyMessage');
            if($formContainer.length){
                var id = $('div[data-form-builder-id]').attr('data-form-builder-id');
                var isMatchFound = false;
                $.each(config.forms,function (index,form) {
                    if(id===form._id){
                        isMatchFound = true;
                        $selectedForm.text(form.Name);
                        $selectedForm.removeClass('hidden');
                        $emptyMessage.addClass('hidden');
                    }
                });
                if(!isMatchFound){ //if match not found then show the empty message
                    $selectedForm.addClass('hidden');
                    $emptyMessage.removeClass('hidden');
                }
            }
        }
    }

    /**
     * @method setLinkEditOptions
     * @description function to add event for link edit options show and hide the edit button
     */
    function setLinkEditButtonOptions() {
        $(document).off('click');
        $(document).on('click', '.ROeditable a,button', function (){
	        updateLinkButtons.call(this);
	        setTimeout(updateLinkButtons.bind(this),75);
        });
        $(document).on('click', '.ROeditable .fa',insertIcon);
    }

	/**
	 * @method getUUID
	 * @description function to get uuid
	 * @returns {string}
	 */
	function getUUID(){
		var text = '';
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
		for( var i=0; i < 10; i++ )
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		return text;
	}

	/**
	 * @method updateLinkButtons
	 * @description function to show hide the link buttons according to condition
	 */
	function updateLinkButtons(){
		var isFileLink = $(this).hasClass('fileLink');
		var isButtonLink = $(this).hasClass('buttonLink');
		var isPageLink = !!$(this).attr('data-page-redirect');
		var $editLink = $('[data-cmd="linkEditCustome"]'),
			    $fileLink = $('[data-cmd="fileEdit"]'),
			$openLink = $('[data-cmd="linkOpen"]'),
			    $buttonLink = $('[data-cmd="btnEditCustome"]');
		if ($('[data-cmd="linkOpen"]').hasClass('fr-hidden')) { //check if the link open button is hidden then hide all other buttons
			$editLink.hide();
			$fileLink.hide();
			$buttonLink.hide();
			return;
		}
		if(isPageLink){
			$editLink.show();
			$fileLink.hide();
			$buttonLink.hide();
			$openLink.hide();
		} else if (isFileLink) {  //if file link then show the file link menu an hide the normal edit link menu
			$editLink.hide();
			$fileLink.show();
			$buttonLink.hide();
			$openLink.show();
		} else if(isButtonLink){
			$fileLink.hide();
			$openLink.hide();
			$editLink.show();
			$buttonLink.show();
		} else {         //else show the normal edit link menu
			if($(this).hasClass('ROsaveButton')){
				$fileLink.hide();
				$openLink.hide();
				$editLink.show();
				$buttonLink.show();

			} else {
				$openLink.show();
				$fileLink.hide();
				$editLink.show();
				$buttonLink.hide();
			}
		}
	}

    /**
     * @method setCategories
     * @description function to set the categories
     * //BOMB-1514
     */
    function setCategories(){
        $(config.templateZone).before('<div id="ROcategory-container" style="display: none">' +
            '<select id="template-categories" class="form-control"></select></div>');
        var $templateCategorySelect = $('#template-categories');
        $.each(config.categories, function(index,category) {
            $templateCategorySelect.append(
                $('<option></option>').val(category.value).html(category.name)
            );
        });
        $templateCategorySelect.val('default');
        setTemplatesAsPerCategory();
        //set the function to set the category change event
        $templateCategorySelect.on('change',function(){
            setTemplatesAsPerCategory();
        });

        /**
         * @method setTemplatesAsPerCategory
         * @description function to set the templates as per the category selected
         */
        function setTemplatesAsPerCategory(){
            var selectedCategory = $templateCategorySelect.val();
            $.each(ROtemplate,function(index,template){
                if (selectedCategory === 'all') {
                    $('#ROEditor_'+template.id).show();
                } else if (selectedCategory === 'default') {
                    if(template.isDefault){
                        $('#ROEditor_'+template.id).show();
                    } else {
                        $('#ROEditor_'+template.id).hide();
                    }
                } else  {
                    var isFound = false;
                    $.each(template.category, function (index, _category) {
                        if (_category.value === selectedCategory) {
                            $('#ROEditor_' + template.id).show();
                            isFound = true;
                        }
                    });
                    if (!isFound) {
                        $('#ROEditor_'+template.id).hide();
                    }
                }
            });

        }
    }

    /**
     * @method addROtemplateToDropZone
     * @description function to add the placeholder when the content area is empty
     */
    function addPlaceHolder() {
        if(!$.trim($dropZone.html())){
            $dropZone.append('<div class="ROemptyPlaceHolder">Please drag and drop the UI element here.</div>');
        }
    }

    /**
     * @method removePlaceHolder
     * @description function to remove the placeholder
     */
    function removePlaceHolder(){
        $dropZone.find('.ROemptyPlaceHolder').remove();
    }


    /**
     * @method addROtemplateToTemplateZone
     * @description function to add the template to ROtemplate zone
     */
    function addROtemplateToTemplateZone() {
        $.each(ROtemplate, function (key,value) {
            $templateZone.append('<div class="ROtemplate" id="ROEditor_'+value.id+'" title="'+value.text +'">'+
                '<img src="'+config.imagePath+value.image+'" alt="'+value.text+'">'+
                '<span class="ROidContainer" style="display: none;">'+value.id+'</span>' +
                '</div>');
        });

        //make the side ROtemplate droppable
        $templateZone.find('.ROtemplate').draggable({
            appendTo: 'body',
            helper: 'clone'
        });
    }

    /**
     * @method insertIcon
     * @description function to inset the font-awesome icon
     * @tickets: BOMB-3229,BOMB-3531
     */
    function insertIcon(event1){
        var me = this,
            isFromFroala = !!me.selection;
        if(isFromFroala){ //check if insert icon function is called from the editor
            me.selection.save();
        }
        var faIcons = ['500px','adjust','adn','align-center','align-justify','align-left','align-right','amazon','ambulance','anchor','android','angellist','angle-double-down','angle-double-left','angle-double-right','angle-double-up','angle-down','angle-left','angle-right','angle-up','apple','archive','area-chart','arrow-circle-down','arrow-circle-left','arrow-circle-o-down','arrow-circle-o-left','arrow-circle-o-right','arrow-circle-o-up','arrow-circle-right','arrow-circle-up','arrow-down','arrow-left','arrow-right','arrow-up','arrows','arrows-alt','arrows-h','arrows-v','asterisk','at','automobile','backward','balance-scale','ban','bank','bar-chart','bar-chart-o','barcode','bars','battery-0','battery-1','battery-2','battery-3','battery-4','battery-empty','battery-full','battery-half','battery-quarter','battery-three-quarters','bed','beer','behance','behance-square','bell','bell-o','bell-slash','bell-slash-o','bicycle','binoculars','birthday-cake','bitbucket','bitbucket-square','bitcoin','black-tie','bold','bolt','bomb','book','bookmark','bookmark-o','briefcase','btc','bug','building','building-o','bullhorn','bullseye','bus','buysellads','cab','calculator','calendar','calendar-check-o','calendar-minus-o','calendar-o','calendar-plus-o','calendar-times-o','camera','camera-retro','car','caret-down','caret-left','caret-right','caret-square-o-down','caret-square-o-left','caret-square-o-right','caret-square-o-up','caret-up','cart-arrow-down','cart-plus','cc','cc-amex','cc-diners-club','cc-discover','cc-jcb','cc-mastercard','cc-paypal','cc-stripe','cc-visa','certificate','chain','chain-broken','check','check-circle','check-circle-o','check-square','check-square-o','chevron-circle-down','chevron-circle-left','chevron-circle-right','chevron-circle-up','chevron-down','chevron-left','chevron-right','chevron-up','child','chrome','circle','circle-o','circle-o-notch','circle-thin','clipboard','clock-o','clone','close','cloud','cloud-download','cloud-upload','cny','code','code-fork','codepen','coffee','cog','cogs','columns','comment','comment-o','commenting','commenting-o','comments','comments-o','compass','compress','connectdevelop','contao','copy','copyright','creative-commons','credit-card','crop','crosshairs','css3','cube','cubes','cut','cutlery','dashboard','dashcube','database','dedent','delicious','desktop','deviantart','diamond','digg','dollar','dot-circle-o','download','dribbble','dropbox','drupal','edit','eject','ellipsis-h','ellipsis-v','empire','envelope','envelope-o','envelope-square','eraser','eur','euro','exchange','exclamation','exclamation-circle','exclamation-triangle','expand','expeditedssl','external-link','external-link-square','eye','eye-slash','eyedropper','facebook','facebook-f','facebook-official','facebook-square','fast-backward','fast-forward','fax','feed','female','fighter-jet','file','file-archive-o','file-audio-o','file-code-o','file-excel-o','file-image-o','file-movie-o','file-o','file-pdf-o','file-photo-o','file-picture-o','file-powerpoint-o','file-sound-o','file-text','file-text-o','file-video-o','file-word-o','file-zip-o','files-o','film','filter','fire','fire-extinguisher','firefox','flag','flag-checkered','flag-o','flash','flask','flickr','floppy-o','folder','folder-o','folder-open','folder-open-o','font','fonticons','forumbee','forward','foursquare','frown-o','futbol-o','gamepad','gavel','gbp','ge','gear','gears','genderless','get-pocket','gg','gg-circle','gift','git','git-square','github','github-alt','github-square','gittip','glass','globe','google','google-plus','google-plus-square','google-wallet','graduation-cap','gratipay','group','h-square','hacker-news','hand-grab-o','hand-lizard-o','hand-o-down','hand-o-left','hand-o-right','hand-o-up','hand-paper-o','hand-peace-o','hand-pointer-o','hand-rock-o','hand-scissors-o','hand-spock-o','hand-stop-o','hdd-o','header','headphones','heart','heart-o','heartbeat','history','home','hospital-o','hotel','hourglass','hourglass-1','hourglass-2','hourglass-3','hourglass-end','hourglass-half','hourglass-o','hourglass-start','houzz','html5','i-cursor','ils','image','inbox','indent','industry','info','info-circle','inr','instagram','institution','internet-explorer','intersex','ioxhost','italic','joomla','jpy','jsfiddle','key','keyboard-o','krw','language','laptop','lastfm','lastfm-square','leaf','leanpub','legal','lemon-o','level-down','level-up','life-bouy','life-buoy','life-ring','life-saver','lightbulb-o','line-chart','link','linkedin','linkedin-square','linux','list','list-alt','list-ol','list-ul','location-arrow','lock','long-arrow-down','long-arrow-left','long-arrow-right','long-arrow-up','magic','magnet','mail-forward','mail-reply','mail-reply-all','male','map','map-marker','map-o','map-pin','map-signs','mars','mars-double','mars-stroke','mars-stroke-h','mars-stroke-v','maxcdn','meanpath','medium','medkit','meh-o','mercury','microphone','microphone-slash','minus','minus-circle','minus-square','minus-square-o','mobile','mobile-phone','money','moon-o','mortar-board','motorcycle','mouse-pointer','music','navicon','neuter','newspaper-o','object-group','object-ungroup','odnoklassniki','odnoklassniki-square','opencart','openid','opera','optin-monster','outdent','pagelines','paint-brush','paper-plane','paper-plane-o','paperclip','paragraph','paste','pause','paw','paypal','pencil','pencil-square','pencil-square-o','phone','phone-square','photo','picture-o','pie-chart','pied-piper','pied-piper-alt','pinterest','pinterest-p','pinterest-square','plane','play','play-circle','play-circle-o','plug','plus','plus-circle','plus-square','plus-square-o','power-off','print','puzzle-piece','qq','qrcode','question','question-circle','quote-left','quote-right','ra','random','rebel','recycle','reddit','reddit-square','refresh','registered','remove','renren','reorder','repeat','reply','reply-all','retweet','rmb','road','rocket','rotate-left','rotate-right','rouble','rss','rss-square','rub','ruble','rupee','safari','save','scissors','search','search-minus','search-plus','sellsy','send','send-o','server','share','share-alt','share-alt-square','share-square','share-square-o','shekel','sheqel','shield','ship','shirtsinbulk','shopping-cart','sign-in','sign-out','signal','simplybuilt','sitemap','skyatlas','skype','slack','sliders','slideshare','smile-o','soccer-ball-o','sort','sort-alpha-asc','sort-alpha-desc','sort-amount-asc','sort-amount-desc','sort-asc','sort-desc','sort-down','sort-numeric-asc','sort-numeric-desc','sort-up','soundcloud','space-shuttle','spinner','spoon','spotify','square','square-o','stack-exchange','stack-overflow','star','star-half','star-half-empty','star-half-full','star-half-o','star-o','steam','steam-square','step-backward','step-forward','stethoscope','sticky-note','sticky-note-o','stop','street-view','strikethrough','stumbleupon','stumbleupon-circle','subscript','subway','suitcase','sun-o','superscript','support','table','tablet','tachometer','tag','tags','tasks','taxi','television','tencent-weibo','terminal','text-height','text-width','th','th-large','th-list','thumb-tack','thumbs-down','thumbs-o-down','thumbs-o-up','thumbs-up','ticket','times','times-circle','times-circle-o','tint','toggle-down','toggle-left','toggle-off','toggle-on','toggle-right','toggle-up','trademark','train','transgender','transgender-alt','trash','trash-o','tree','trello','tripadvisor','trophy','truck','try','tty','tumblr','tumblr-square','turkish-lira','tv','twitch','twitter','twitter-square','umbrella','underline','undo','university','unlink','unlock','unlock-alt','unsorted','upload','usd','user','user-md','user-plus','user-secret','user-times','users','venus','venus-double','venus-mars','viacoin','video-camera','vimeo','vimeo-square','vine','vk','volume-down','volume-off','volume-up','warning','wechat','weibo','weixin','whatsapp','wheelchair','wifi','wikipedia-w','windows','won','wordpress','wrench','xing','xing-square','y-combinator','y-combinator-square','yahoo','yc','yc-square','yelp','yen','youtube','youtube-play','youtube-square'];
        var html = '<div class="ROFaModel">';
        faIcons.forEach(function(icon){
            html = html + '<div class="icon-container">' +
                '<i class="fa fa-'+icon+'" title="'+icon+'"></i>' +
                '<span>'+icon+'</span>'+
                '</div>';
        });
        openPopUp(html);
        $('.ROFaModel .fa').click(function(event){
            closePopUp();
            var selectedClass = $(event.target).attr('class');
            if(isFromFroala) {
                me.selection.restore();
                me.html.insert('<span class="' + selectedClass + '"></span>', true);
            } else {
                selectedClass = $.grep(selectedClass.split(/\s+/),function(currentClass){
                    return (currentClass.match(new RegExp('fa-')) && currentClass.match(new RegExp('fa-')).length);
                })[0];
                var newClasses = $.grep($(event1.target).attr('class').split(/\s+/),function(currentClass){
                    return !currentClass.match(new RegExp('fa-'));
                });
                newClasses.push(selectedClass);
                $(event1.target).replaceWith('<span class="' + newClasses.join(' ') + '"></span>');
            }
        });
    }

    /**
     * @method addFroalaButtons
     * @description function to add the custome froala buttons
     * @tickets: BOMB-3229,BOMB-3657
     */
    function addFroalaButtons(){
        $.FroalaEditor.DefineIcon('insertIcon', {NAME: 'flag'});
        $.FroalaEditor.RegisterCommand('insertIcon', {
            title: 'Insert Icon',
            focus: false,
            undo: true,
            refreshAfterCallback: true,
            callback: insertIcon
        });
        $.FroalaEditor.DefineIcon('insertFileLink', {NAME: 'file-text-o'});
        $.FroalaEditor.RegisterCommand('insertFileLink', {
            title: 'Insert File Link',
            focus: false,
            undo: true,
            refreshAfterCallback: true,
            callback: _insertFileLink
        });
	    $.FroalaEditor.DefineIcon('insertPageLink', {NAME: 'anchor'});
	    $.FroalaEditor.RegisterCommand('insertPageLink', {
		    title: 'Insert Page Link',
		    focus: false,
		    undo: true,
		    refreshAfterCallback: true,
		    callback: _insertPageLink
	    });
        $.FroalaEditor.DefineIcon('fileEdit', {NAME: 'edit'});
        $.FroalaEditor.RegisterCommand('fileEdit', {
            title: 'Edit File Link',
            focus: false,
            undo: true,
            refreshAfterCallback: true,
            callback: _insertFileLink
        });

        $.FroalaEditor.DefineIcon('insertLinkCustome', {NAME: 'link'});
        $.FroalaEditor.RegisterCommand('insertLinkCustome', {
            title: 'Insert Link',
            focus: false,
            undo: true,
            refreshAfterCallback: true,
            callback: _insertLink
        });

        $.FroalaEditor.DefineIcon('insertBtnCustome', {NAME: 'fa fa-plus-square'});
        $.FroalaEditor.RegisterCommand('insertBtnCustome', {
            title: 'Insert Button',
            focus: false,
            undo: true,
            refreshAfterCallback: true,
            callback: _insertBtn
        });

        $.FroalaEditor.DefineIcon('linkEditCustome', {NAME: 'edit'});
        $.FroalaEditor.RegisterCommand('linkEditCustome', {
            title: 'Edit',
            focus: false,
            undo: true,
            refreshAfterCallback: true,
            callback: _insertLink
        });

	    $.FroalaEditor.DefineIcon('btnEditCustome', {NAME: 'fa fa-eyedropper'});
	    $.FroalaEditor.RegisterCommand('btnEditCustome', {
		    title: 'Change color',
		    focus: false,
		    undo: true,
		    refreshAfterCallback: true,
		    callback: _editBtn
	    });

	    function _editBtn(){
		    var me = this,
		        oldLink = me.link.get();
		        me.selection.save();
		    var  textColor = rgb2hex($(oldLink).css('color'));
		    var  backgroundColor = rgb2hex($(oldLink).css('background-color'));
		    function rgb2hex(rgb) {
			    if (/^#[0-9A-F]{6}$/i.test(rgb)){
				    return rgb;
			    }
			    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
			    function hex(x) {
				    return ('0' + parseInt(x).toString(16)).slice(-2);
			    }
			    if(rgb){
				    return '#' + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
			    }

		    }
		    var html = '<div class="ROLinkButton color-type">'+
			        '<div class="icon-container">' +
			        '<div class="ROButtonColor" ng-if="isEditBtn">' +
				    '<label>Button color</label>'+
				    '<input type="text" id="myBackgroundColor"/>'+
				    '</div>'+
			    '<div class="ROButtonTextColor">' +
			    '<label>Button Text color</label>'+
				    '<input type="text" id="myTextColor" >'+
				    '</div>'+
			    '<div class="ROEditor_btns">' +
			    '<button class="btn btn-sm btn-normal ROsaveButtonPopUp">Edit</button>' +
			    '</div>' +
			    '</div>' +
				    '</div>';

		    setTimeout(function(){
			    $('#myBackgroundColor, #myTextColor').spectrum({
				    showPaletteOnly: true,
				    togglePaletteOnly: true,
				    togglePaletteMoreText: 'more',
				    togglePaletteLessText: 'less',
				    hideAfterPaletteSelect:true,
				    preferredFormat: "hex",
				    palette: [
					    ["rgb(0, 0, 0)", "rgb(67, 67, 67)", "rgb(102, 102, 102)",
						    "rgb(204, 204, 204)", "rgb(217, 217, 217)","rgb(255, 255, 255)"],
					    ["rgb(152, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 153, 0)", "rgb(255, 255, 0)", "rgb(0, 255, 0)",
						    "rgb(0, 255, 255)", "rgb(74, 134, 232)", "rgb(0, 0, 255)", "rgb(153, 0, 255)", "rgb(255, 0, 255)"],
					    ["rgb(230, 184, 175)", "rgb(244, 204, 204)", "rgb(252, 229, 205)", "rgb(255, 242, 204)", "rgb(217, 234, 211)",
						    "rgb(208, 224, 227)", "rgb(201, 218, 248)", "rgb(207, 226, 243)", "rgb(217, 210, 233)", "rgb(234, 209, 220)",
						    "rgb(221, 126, 107)", "rgb(234, 153, 153)", "rgb(249, 203, 156)", "rgb(255, 229, 153)", "rgb(182, 215, 168)",
						    "rgb(162, 196, 201)", "rgb(164, 194, 244)", "rgb(159, 197, 232)", "rgb(180, 167, 214)", "rgb(213, 166, 189)",
						    "rgb(204, 65, 37)", "rgb(224, 102, 102)", "rgb(246, 178, 107)", "rgb(255, 217, 102)", "rgb(147, 196, 125)",
						    "rgb(118, 165, 175)", "rgb(109, 158, 235)", "rgb(111, 168, 220)", "rgb(142, 124, 195)", "rgb(194, 123, 160)",
						    "rgb(166, 28, 0)", "rgb(204, 0, 0)", "rgb(230, 145, 56)", "rgb(241, 194, 50)", "rgb(106, 168, 79)",
						    "rgb(69, 129, 142)", "rgb(60, 120, 216)", "rgb(61, 133, 198)", "rgb(103, 78, 167)", "rgb(166, 77, 121)",
						    "rgb(91, 15, 0)", "rgb(102, 0, 0)", "rgb(120, 63, 4)", "rgb(127, 96, 0)", "rgb(39, 78, 19)",
						    "rgb(12, 52, 61)", "rgb(28, 69, 135)", "rgb(7, 55, 99)", "rgb(32, 18, 77)", "rgb(76, 17, 48)"]
				    ]
			    });
			    if(textColor){
				    $('#myTextColor').spectrum('set', textColor);
				    //$('#myTextColor').val(rgb2hex(textColor));
			    }
			    if(backgroundColor){
				    $('#myBackgroundColor').spectrum('set', backgroundColor);
				    //$('#myBackgroundColor').val(rgb2hex(backgroundColor));
			    }
		    },100);

		    openPopUp(html);
		    $('.ROsaveButtonPopUp').on('click', function (event) {
			    var color = ($('#myBackgroundColor').spectrum('get')).toHexString();
			    var color1 = ($('#myTextColor').spectrum('get')).toHexString();
			    //$(oldLink).css('background', color);
			    $(oldLink).css('cssText', 'background-color:'+color+'; color:'+color1+' !important;');
			    closePopUp();
		    });
	        }

        /**
         * @method _insertLink
         * @description function to insert and update the link of the content
         * @private
         * @tickets: BOMB-3337,BOMB-3657
         */
        function _insertLink() {
	        var me = this,
                oldLink = me.link.get();
	        if($(oldLink).attr('data-page-redirect')){
		        return _insertPageLink.call(this);
	        }
            me.selection.save();
            openPopUp(linkPopUpContent);
            //get and set the old link data
            var textInput = $('.ROimageEditor .RO-link-text input'),
                linkInput = $('.ROimageEditor .RO-link-url input'),
                newTabInput = $('.ROimageEditor .ROimgLinkIsNew input'),
                text = $(oldLink).text() || me.selection.text(),
                doEditText = !($(oldLink).parent().hasClass('career-benefits-box') || $(oldLink).parent().hasClass('career-donate-logos') || $(oldLink).parents('.career-benefits-box').length);
            if(!doEditText){
                $('.ROimageEditor .RO-link-text').hide();
                $('.ROimageEditor.ROLinkEditor').height(134);
            } else {
                textInput.val($(oldLink).text() || me.selection.text());
            }
            linkInput.val($(oldLink).attr('href'));
            newTabInput.attr('checked', $(oldLink).attr('target') === '_blank');
            $('.ROimageEditor .ROsavePopUp').on('click', function () {
                //get the values of the link properties
                var text = textInput.val(),
                    url = linkInput.val(),
                    target = newTabInput.is(':checked') ? '_blank' : '',
                    invalidTextHtml = '',
                    invalidUrlHtml = '',
                    isInvalid = false;
                if(!text && doEditText){ //if text field is empty and doEditText field is true then set validation
                    invalidTextHtml = 'Text is required.';
                    isInvalid = true;
                }
                $('.ROimageEditor .RO-popup-message.RO-popup-message-text').html(invalidTextHtml);
                $('.ROimageEditor .RO-popup-message.RO-popup-message-url').html(invalidUrlHtml);
                if(isInvalid){
                    return false;
                }
                if (oldLink) {
                    $(oldLink).attr('href', url).attr('target', target);
                    if(doEditText){ //if doEditText is true then only edit.
                        $(oldLink).html(text);
                    }
                } else {
                    me.link.insert(url, text, {'target': target});
                }
                closePopUp();
            });
        }

        /**
         * @method _insertBtn
         * @description function to insert and update the btn of the content
         * @private
         * @tickets: BOMB-3556
         */
        function _insertBtn() {
            var me = this,
                oldLink = me.link.get();
            me.selection.save();
            openPopUp(buttonPopUpContent);
            //get and set the old link data
            var textInput = $('.ROimageEditor .RO-btn-text input'),
                linkInput = $('.ROimageEditor .RO-btn-url input'),
                newTabInput = $('.ROimageEditor .ROimgLinkIsNew input'),
                text = $(oldLink).text() || me.selection.text(),
                doEditText = !($(oldLink).parent().hasClass('career-benefits-box') || $(oldLink).parent().hasClass('career-donate-logos') || $(oldLink).parents('.career-benefits-box').length);
            if(!doEditText){
                $('.ROimageEditor .RO-btn-text').hide();
                $('.ROimageEditor.ROLinkEditor').height(134);
            } else {
                textInput.val($(oldLink).text() || me.selection.text());
            }
            linkInput.val($(oldLink).attr('href'));
            newTabInput.attr('checked', $(oldLink).attr('target') === '_blank');
            $('.ROimageEditor .ROsavePopUp').on('click', function () {
                //get the values of the link properties
                var text = textInput.val(),
                    url = linkInput.val(),
                    target = newTabInput.is(':checked') ? '_blank' : '',
                    invalidTextHtml = '',
                    invalidUrlHtml = '',
                    isInvalid = false;
                if(!text && doEditText){ //if text field is empty and doEditText field is true then set validation
                    invalidTextHtml = 'Text is required.';
                    isInvalid = true;
                }
                $('.ROimageEditor .RO-popup-message.RO-popup-message-text').html(invalidTextHtml);
                $('.ROimageEditor .RO-popup-message.RO-popup-message-url').html(invalidUrlHtml);
                if(isInvalid){
                    return false;
                }
                if (oldLink) {
                    $(oldLink).attr('href', url).attr('target', target);
                    if(doEditText){ //if doEditText is true then only edit.
                        $(oldLink).html(text);
                    }
                } else {
	                var randomClass = getUUID();
	                me.link.insert(url, text, {'target': target, 'class':'btn buttonLink '+randomClass});
                }
                closePopUp();
            });
        }

        /**
         * @method _insertFileLink
         * @description function to insert the file link
         * @private
         */
        function _insertFileLink() {
            var me = this;
            setTimeout(function () {
                me.toolbar.hide();
            }, 200);
            me.selection.save();
            var link = me.link.get();
            //open the media manager
            angular.element('#main_div').scope().cvm.openChooseMedia(null, function (data) {
                me.selection.restore();
                if (data.value && data.value.Url) {
                    if (!link) {
                        me.link.insert(data.value.Url, me.selection.text(), {
                            'target': data.value.isNewTab ? '_blank' : '',
                            'class': 'fileLink'
                        });
                    } else {
                        $(link).attr('href', data.value.Url).attr('target', data.value.isNewTab ? '_blank' : '');
                    }
                    setLinkEditButtonOptions();
                    $('[data-cmd="linkEditCustome"]').hide();
                    $('[data-cmd="btnEditCustome"]').hide();
                    $('[data-cmd="fileEdit"]').show();
                }
            });
        }

	    /**
	     * @method _insertPageLink
	     * @description function to insert the page link
	     * @tickets BOMB-3657
	     * @private
	     */
	    function _insertPageLink(){
		    var me = this,
			    oldLink = me.link.get(),
			    text = $(oldLink).text() || me.selection.text(),
			    oldValue = parseInt($(oldLink).attr('page-redirect'));
		    oldValue = isNaN(oldValue)?1:oldValue;
		    me.selection.save();
		    var popupContent = $(pageLinkPopUpContent);
		    openPopUp(popupContent);
		    //get and set the old link data
		    var sectionSelect = $('.ROLinkEditor .RO-link-selector select');
		    sectionSelect.select2({
			    placeholder: "Select form",
			    minimumResultsForSearch: -1,
			    allowClear:false
		    });
		    var i = 1;
		    $('.ROtemplateContainer').each(function(){
			    popupContent.find('select').append($('<option>')
				    .val(i)
				    .html('Page Section'+i));
			    i++;
		    });
		    sectionSelect.val(oldValue);
		    $('.ROLinkEditor .ROsavePopUp').on('click', function () {
			    //get the values of the link properties
			    var selectedSection = sectionSelect.val(),
				    url = '#Section'+selectedSection;
			    if (oldLink) {
				    $(oldLink).attr('href', url);
			    } else {
				    me.link.insert(url, text, {'data-page-redirect': selectedSection});
			    }
			    closePopUp();
		    });
	    }
    }

    /**
     * @method applyFroala
     * @description apply the froala to the respective class
     * @tickets BOMB-3657
     */
    function applyFroala(){
        $('.ROtemplateContainer .ROeditable').froalaEditor({
            linkInsertButtons:['linkBack'], //remove the default link selector button from the link selection
            linkEditButtons: ['linkOpen', 'linkEditCustome','btnEditCustome','fileEdit', 'linkRemove'],
            // enter: $.FroalaEditor.ENTER_BR,
            paragraphFormat: {
                N: 'Normal',
                H1: 'Heading 1',
                H2: 'Heading 2',
                H3: 'Heading 3',
                H4: 'Heading 4'
            },
	        linkStyles: {
		        class1: 'Class 1',
		        class2: 'Class 2',
		        class3: 'Class 3'
	        },
            toolbarButtons: ['fullscreen', 'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'undo', 'redo', 'clearFormatting', 'selectAll', '-', 'fontFamily', 'paragraphFormat', 'fontSize', 'color', '|', 'emoticons', 'inlineStyle', 'paragraphStyle', '|', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', '-', 'insertTable', 'quote', 'insertHR', 'insertLinkCustome', 'insertPageLink','insertFileLink','insertIcon','insertBtnCustome'],
            toolbarButtonsSM: ['fullscreen', 'bold', 'italic', 'underline', 'fontFamily', 'paragraphFormat', 'fontSize', 'insertTable', 'undo', 'redo', 'insertLinkCustome', 'insertFileLink','insertIcon','insertBtnCustome'],
            toolbarButtonsMD: ['fullscreen', 'bold', 'italic', 'underline', 'fontFamily', 'paragraphFormat', 'fontSize', 'color', 'paragraphStyle', 'align', 'formatOL', 'formatUL', '-', 'outdent', 'indent', 'quote', 'insertHR', 'insertTable', 'undo', 'redo', 'clearFormatting', 'insertLinkCustome', 'insertFileLink','insertIcon','insertBtnCustome'],
            fullPage: false,
            toolbarInline: true,
            charCounterCount: false,
            key:'oGLGTI1DMJc1BWLg1PO==',
            imageInsertButtons:false,
            //this option is used to allow the onclick attribute inside the htmlAllowedAttrs
            // htmlAllowedAttrs:['accept', 'accept-charset', 'accesskey', 'action', 'align', 'alt', 'async', 'autocomplete', 'autofocus', 'autoplay', 'autosave', 'background', 'bgcolor', 'border', 'charset', 'cellpadding', 'cellspacing', 'checked', 'cite', 'class', 'color', 'cols', 'colspan', 'content', 'contenteditable', 'contextmenu', 'controls', 'coords', 'data', 'data-.*', 'datetime', 'default', 'defer', 'dir', 'dirname', 'disabled', 'download', 'draggable', 'dropzone', 'enctype', 'for', 'form', 'formaction', 'headers', 'height', 'hidden', 'high', 'href', 'hreflang', 'http-equiv', 'icon', 'id', 'ismap', 'itemprop', 'keytype', 'kind', 'label', 'lang', 'language', 'list', 'loop', 'low', 'max', 'maxlength', 'media', 'method', 'min', 'multiple', 'name', 'novalidate', 'open', 'optimum', 'pattern', 'ping', 'placeholder', 'poster', 'preload', 'pubdate', 'radiogroup', 'readonly', 'rel', 'required', 'reversed', 'rows', 'rowspan', 'sandbox', 'scope', 'scoped', 'scrolling', 'seamless', 'selected', 'shape', 'size', 'sizes', 'span', 'src', 'srcdoc', 'srclang', 'srcset', 'start', 'step', 'summary', 'spellcheck', 'style', 'tabindex', 'target', 'title', 'type', 'translate', 'usemap', 'value', 'valign', 'width', 'wrap','onclick'],
            imageEditButtons: ['imageAlign', 'imageRemove', 'imageLink', 'linkOpen', 'linkEdit', 'linkRemove', '-', 'imageDisplay', 'imageStyle', 'imageAlt', 'imageSize']
        });
    }

    /**
     * @method removeTemplateHandle
     * @description Function to remove the template from the editor
     * @param button button to find the parent to remove
     */
    function removeTemplateHandle(button){
        $(button).parent().parent('.ROtemplateContainer').remove();
        addPlaceHolder();
    }

    /**
     * @method cloneTemplateHandle
     * @description Function to add duplicate template to the editor
     * @tickets: BOMB-2646
     */
     function cloneTemplateHandle(button){
        var templateContents = $(button).parents('.ROtemplateContainer');
        templateContents.find('.ROeditable').froalaEditor('destroy');
        var cloneTemplate = templateContents.clone();
        cloneTemplate.insertAfter(templateContents);
        afterAddTemplate();
        compileHtmlForAngular(cloneTemplate);
        addListners(cloneTemplate);
     }

    /**
     * @method insertTemplate
     * @description function to insert the template inside the dropzone
     * @param id
     * @param target
     * @tickets BOMB-2029
     */
    function insertTemplate(id,target) {
        var template = $(ROtemplate[id].template);
        //allow only one form to be add
        if($('.ROtemplateContainer .ROFormContainer').length && template.find('.ROFormContainer').length){
            showErrorPopup('You can add only one form.');
            $('#_ht-container .ROtemplate').remove();
            return;
        }
        addHandlers(template);
        template.append('<span class="ROidContainer" style="display:none">'+id+'</span>'); //add the id to the container to use it further
        if(target){ //if drop target is found then add the template next to target and remove the target
            target.after(template);
            target.remove();
        } else {
            $dropZone.append(template);
        }
        afterAddTemplate();
    }

    /**
     * @method compileHtmlForAngular
     * @description function to compile the html for the angular
     * @param htmlContent
     */
    function compileHtmlForAngular(htmlContent) {
        setTimeout(function(){
            try{
                angular.element(document).injector().invoke(['$compile','$rootScope',function($compile,$rootScope){  // jshint ignore:line
                    var obj=$(config.dropZone); // get wrapper
                    var scope=obj.scope(); // get scope
                    $compile(htmlContent)(scope);
                    $rootScope.$digest();
                }]);
            } catch(e){}
        },500);
    }

    /**
     * @method showErrorPopup
     * @description function to show error popup with message
     * @param msg
     * @tickets BOMB-2029
     */
    function showErrorPopup(msg){
        $.fancybox({
            'modal': true,
            'content': '<div style="margin:1px;width:240px;text-align:center">' +
            '<h4>' + msg + '</h4>' +
            '<br>' +
            '<input id="fancyConfirm_cancel" class="btn" type="button" value="OK">' +
            '<div>',
            afterShow: function () {
                $('#fancyConfirm_cancel').click(function () {
                    $.fancybox.close();
                });
            }
        });
    }

    /**
     * @method openEditBannerLinkPopUp
     * @description function to open the edit link of the banner
     * @tickets: BOMB-3337
     */
    function openEditBannerLinkPopUp(linkButton){
        var  oldLink = $(linkButton).parents('.ROtemplateContainer');
        openPopUp(linkPopUpContent);
        //get and set the old link data
        var textInput = $('.ROimageEditor .RO-link-text input'),
            linkInput = $('.ROimageEditor .RO-link-url input'),
            newTabInput = $('.ROimageEditor .ROimgLinkIsNew input');
        $('.ROimageEditor .RO-link-text').hide();
        $('.ROimageEditor.ROLinkEditor').height(134);
        linkInput.val($(oldLink).attr('data-link'));
        newTabInput.attr('checked', $(oldLink).attr('data-link-target') === '_blank');
        $('.ROimageEditor .ROsavePopUp').on('click', function () {
            //get the values of the link properties
            var text = textInput.val(),
                url = linkInput.val(),
                target = newTabInput.is(':checked') ? '_blank' : '';
            $(oldLink).attr('data-link', url).attr('data-link-target', target);
            closePopUp();
        });
    }

    /**
     * @method addHandlers
     * @description function to add hanlders for template , image and youtube video
     * @param target
     * @ticket RED-511, BOMB-2029,BOMB-2940,BOMB-3337
     */
    function addHandlers(target){
        target = target || $(config.dropZone).find('.ROtemplateContainer'); //if target is not passed add handlers to all the template container
	    target.append(handlerContent);  //add the handler to the templateZone
        if(target.find('.ROimageContainer').length){
		    target.find('.ROimageContainer').append(imageHandlerContent);
	    }
	    if(target.filter('.careerlanding-video').length){
		    setTimeout(function(){
			    target.filter('.careerlanding-video').find('.ROimageContainer').append(careerVideoImageContent);
                compileHtmlForAngular(target.filter('.careerlanding-video'));
		    }, 1000);
	    }
        if(target.find('.ROyoutubeContainer').length){
            target.find('.ROyoutubeContainer').siblings('.ROhandlers').find('.ROyouTubeHandler').removeClass('hidden');
            target.find('.ROyoutubeContainer').siblings('.ROhandlers').find('.ROyouTubeHandler').click(function (event) {
                openYouTubeEditorPopUp(this, event);
            });
        }
        if(target.find('.career-landing-banner').length){
            target.find('.career-landing-banner').siblings('.ROhandlers').find('.ROyouTubeHandler').click(function (event) {
                openEditBannerLinkPopUp(this, event);
            });
        }
        //remove the edit html and clone from the form control
        if(target.find('.ROFormContainer,[data-alert-list]').length) {
            target.find('.ROFormContainer,[data-alert-list]').siblings('.ROhandlers').find('.ROcloner').addClass('hidden');
            target.find('.ROFormContainer,[data-alert-list]').siblings('.ROhandlers').find('.ROEditHTML').addClass('hidden');
        }
        if(target.find('[data-alert-list]').length) {
            target.find('[data-alert-list]').siblings('.ROhandlers').find('.ROremover').addClass('hidden');
        }
        if(target.find('.ROFormContainer').length){
            target.find('.ROFormContainer').append(formHandlerContent);
        }
        $.each(target,function(key,value){
            compileHtmlForAngular(value);
        });
        addListners(target);
    }

	function updateNewImage() {
		var me = this;
		setTimeout(function () {
			me.toolbar.hide();
		}, 200);
		me.selection.save();
		var link = me.link.get();
		//open the media manager
		angular.element('#main_div').scope().cvm.openChooseMedia(null, function (data) {
			me.selection.restore();
			if (data.value && data.value.Url) {
				if (!link) {
					me.link.insert(data.value.Url, me.selection.text(), {
						'target': data.value.isNewTab ? '_blank' : '',
						'class': 'fileLink'
					});
				} else {
					$(link).attr('href', data.value.Url).attr('target', data.value.isNewTab ? '_blank' : '');
				}
				setLinkEditButtonOptions();
				$('[data-cmd="linkEditCustome"]').hide();
				$('[data-cmd="btnEditCustome"]').hide();
				$('[data-cmd="fileEdit"]').show();
			}
		});
	}


    /**
     * @method addListners
     * @description function to add the listners
     * @param target
     * @tickets: BOMB-2941,BOMB-2799,BOMB-3229
     */
    function addListners(target){
        //add the clone template handler
        target.find('.ROcloner').click(function(){
            cloneTemplateHandle(this);
        });
        //add the remove template handler
        target.find('.ROremover').click(function(){
            removeTemplateHandle(this);
        });
        //add the remove template handler
        target.find('.ROEditHTML').click(function () {
            editTemplateHandle(this);
        });
        //add the listener for the edit the image source
        target.find('.ROEditImage').each(function(){
            $(this).click(function () {
	            $(this).parents('.ROtemplateContainer').find('.ROimageHandler [ng-click]').trigger('click');
            });
        });
        //add listener for edit image hyper link
        target.find('.ROEditImageLink').each(function(){
            $(this).click(function () {
                $(this).parents('.ROtemplateContainer').find('.ROeditImageButton').trigger('click');
            });
        });

	    //add listener for edit video source
	    target.find('.ROEditVideo').each(function(){
		    $(this).click(function () {
			    $(this).parents('.ROtemplateContainer').find('.ROcareerVideoImageContent [ng-click]').trigger('click');
		    });
	    });

        if(target.find('.ROeditImageButton').length){
            if(target.find('.ROeditImageButton').parents('.ROeditable').length){
                applyEventToInnerImages(target);
            } else {
                target.find('.ROeditImageButton').click(function(event){
                    openImageEditorPopUp(this,event);
                });
            }
        }
        if(target.find('.ROeditFormButton').length){
            target.find('.ROeditFormButton').click(function(event){
                openSelectFormPopUp(this,event);
            });
        }
        if(target.find('.ROremoveImageButton').length){
            target.find('.ROremoveImageButton').click(function(event){
                clearImage(this,event);
            });
        }
    }

    /**
     * @method clearImage
     * @description function to clear the image
     * @param target
     * @param event
     * @tickets: BOMB-2799
     */
    function clearImage(target,event){
        $(target).parents('.ROimageContainer').find('img').attr('src','');
    }

    /**
     * @method applyEventToInnerImages
     * @description function to apply event to inner images for the images which are inside the content editor
     * @param target
     * @param timeout
     * @tickets: BOMB-2799
     */
    function applyEventToInnerImages(target,timeout){
        if(target.find('.ROeditImageButton').parents('.ROeditable').length) {
            setTimeout(function () {
                target.find('.ROeditImageButton').parents('.ROeditable').data('froala.editor').$el.on('click', '.ROeditImageButton', function (event) {
                    openImageEditorPopUp(this, event);
                });
                target.find('.ROimageHandler button:first').parents('.ROeditable')
                    .data('froala.editor').$el.on('click', '.ROimageHandler button:first', function (event) {
                    angular.element(this).scope().cvm.openChooseMedia(event);
                });
            }, timeout || 1000 );
        }
    }

    /**
     * @method openSelectFormPopUp
     * @description function to open the popup for the select the form
     * @tickets: BOMB-2029
     */
    function openSelectFormPopUp(button,event){
        event.stopPropagation();
        event.preventDefault();
        var popupContent = $(formSelectContent);
        openPopUp(popupContent);
        for(var i=0;i<config.forms.length;i++){
            var name = config.forms[i].Name;
            name=config.forms[i].IsActive?name:config.forms[i].Name + ' (Inactive)';
            popupContent.find('select').append($('<option>')
                .val(config.forms[i]._id)
                .html(name));
        }
        $('.ROFormSelect select').val($('div[data-form-builder-id]').attr('data-form-builder-id'));
	    $('.ROFormSelect select').select2({
		    placeholder: "Select form",
		    minimumResultsForSearch: -1,
		    allowClear:false
	    });
        popupContent.find('.ROsavePopUp').click(saveFormData);
        popupContent.find('.ROclosePopUp').click(closePopUp);
    }

    /**
     * @method saveFormData
     * @description function to save the form data
     * @tickets: BOMB-2029
     */
    function saveFormData(){
        if(!$('.ROFormSelect select').val()){
            $('.ROFormSelect .RO-popup-message').removeClass('hidden');
        } else {
            $('div[data-form-builder-id]').attr('data-form-builder-id',$('.ROFormSelect select').val());
            $('.ROFormContainer .emptyMessage').addClass('hidden');
            $('.ROFormContainer .selectedForm').removeClass('hidden');
            $('.ROFormContainer .selectedForm').html($('.ROFormSelect option:selected').text());
            closePopUp();
        }
    }

    /**
     * @method editTemplateHandle
     * @description function to edit template html
     * @param button
     */
    function editTemplateHandle(button) {
        var content = $(button).parent().parent('.ROtemplateContainer').find('.fr-view');
        openPopUp(editHtmlPopUpContent);
        var textArea = $('.ROHtmlEditor textarea').val(content.html());
        textArea.val(content.html());
        $('.ROHtmlEditor button').on('click', function () {
            content.html(textArea.val());
            closePopUp();
        });
    }

    /**
     * @method getHtml
     * @description function to get the html from thhe ROContentEditor
     * @tickets: BOMB-3188,BOMB-3336
     */
    function getHtml(){
        $(config.dropZone).find('.ROeditable').froalaEditor('destroy');
        var editlorContent = $dropZone.clone();
        applyFroala();
        //there is an error in updating the click events of the images for the images inside the content page
        //there fore need to find the images which are inside the page and then add the events manually
        $(config.dropZone).find('.ROeditImageButton').each(function(){
            if($(this).parents('.ROeditable').length){
                applyEventToInnerImages($(this).parents('.ROeditable'),2000);
            }
        });
        editlorContent.find('.ROemptyPlaceHolder').remove(); //remove the handler buttons
        editlorContent.find('.ROhandlers').remove(); //remove the handler buttons
        editlorContent.find('.ROimageHandler').remove(); //remove image handler buttons
        editlorContent.find('.RODisalbedWrapper').remove(); //remove the disabled wrapper
        editlorContent.find('.fr-placeholder').remove(); //remove the placeholder
        editlorContent.find('.ROcareerVideoImageContent').remove(); //remove the placeholder
        editlorContent.find('twitter-feed').replaceWith('<twitter-feed></twitter-feed>');
	    editlorContent.find('.open-tree-button').replaceWith('<open-tree-button></open-tree-button>');        editlorContent.find('.ROMediaAlert').replaceWith('<div data-alert-list></div>'); //remove the media alert
        editlorContent.find('.our-vendor').replaceWith('<div data-our-vendor></div>'); //remove the
        editlorContent.find('.career-benefits-area .career-benefits-box').each(function(){
            var $linkBox = $(this);
            //froala editor removes the link from the career landing benefits page
            //so need to find them and add them again.
            if(!$linkBox.children().is('a')){
                var icon = $linkBox.find('h3 a i');
                var link = $linkBox.find('h3 a').attr('href');
                var target = $linkBox.find('h3 a').attr('target');
                var linkText = $linkBox.find('h3').text();
                $linkBox.find('h3').empty();
                $linkBox.find('h3').append(icon).append(linkText);
                var linkHtml  = $linkBox.html();
                $linkBox.empty();
                $linkBox.html('<a href="" style="text-decoration:none !important;" class="box-container"></a>');
                $linkBox.find('a').html(linkHtml).attr('href',link).attr('target',target);
            }
        });
        config.editorData = editlorContent.html();
        return editlorContent.html();
    }

    /**
     * @method afterAddTemplate
     * @description function to do something after adding the template
     * @tickets: BOMB-3229
     */
    function afterAddTemplate() {
        HT_DOT_COM.centerContent(); //center the html content in the full banner view content templates
        setLinkEditButtonOptions();
        applyFroala(); //add froala to each editable
        //prevent the image to open the link
        $(config.dropZone).find('.ROimageContainer').off('click');
        $(config.dropZone).find('.ROimageContainer').click(function(event){
            event.preventDefault();
        });
        compileHtmlForAngular();
    }

    /**
     * @method setHtml
     * @description function to set the html from thhe ROContentEditor
     */
    function setHtml(htmlContent){
        if(!htmlContent){ //if html content is not there then add some templates
            addPlaceHolder();
        } else {
            $(config.dropZone).append(htmlContent);
            addHandlers(); //add the handlers
            afterAddTemplate();
        }
    }

    /**
     * @method saveImageData
     * @description function to store the image data and change the image attributes accordingly
     */
    function saveImageData(){
	    // isAltText variable is used to check whether alt text for image is present or not and set it accordingly.
	    var isAltText = $('.ROimageEditor .ROimgAltText input').val() ? false : true;
	    // isAltText is true means the alt text value is empty and we have o fire validation.
	    if(isAltText){
		    // Below condition check if alreay validation msg display will not append again.
		    if($('.ROimgAltText span').hasClass('error-msg')){
				return;
		    } else {
			    $( ".ROimgAltText" ).append('<div class="ROimgAltErrorBlock" style="margin-top:-15px;"><span class="error-msg" style="color:red;margin-left:130px;">Please enter alt text.</span></div>');
		    }
		    return;
	    }

	    var link = $('.ROimageEditor .ROimgLink input').val(),
            urlRe = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/,
            image = currentImage;
        if(link){
            if (!urlRe.test(link)) {
                $('.ROimageEditor .RO-popup-message').html('Please enter valid url');
                return false;
            } else if (link.indexOf('http://') !== 0 && link.indexOf('https://') !== 0) { //if there is no http in the link then append it
                link = 'http://' + link;
            }
        }
        image.attr('alt',$('.ROimageEditor .ROimgAltText input').val());
        image.attr('title',$('.ROimageEditor .ROimgTitle input').val());
        image.parent('a').attr('href', link);
        image.parent('a').attr('target',$('.ROimageEditor .ROimgLinkIsNew input').is(':checked')?'_blank':'');
        closePopUp();
    }

    /**
     * @method openImageEditorPopUp
     * @description function to open the image editor popup
     * @param button
     * @param event
     */
    function openImageEditorPopUp(button,event){
        event.stopPropagation();
        event.preventDefault();
        currentImage = $(button).parents('.ROimageContainer').find('img');
        var popupContent = $(imagePopUpContent);
        openPopUp(popupContent);
        var image = currentImage;
        $('.ROimageEditor .ROimgAltText input').val(image.attr('alt'));
        $('.ROimageEditor .ROimgTitle input').val(image.attr('title'));
        $('.ROimageEditor .ROimgLink input').val(image.parent().attr('href'));
        $('.ROimageEditor .ROimgLinkIsNew input').attr('checked', image.parent().attr('target') === '_blank');
        popupContent.find('.ROsavePopUp').click(saveImageData);
        popupContent.find('.ROclosePopUp').click(closePopUp);
    }
    /**
     * @method openPopUp
     * @description function to open the popup
     * @param popUpContent html content to display inside the popup
     */
    function openPopUp(popUpContent){
        $('body').css('overflow','hidden');
        popUpDialog = $.fancybox({
            afterClose:function(){$('body').css('overflow','');},
            helpers: {
                overlay: {
                    locked: false
                }
            },
            content:popUpContent
        });
    }

    /**
     * @method closePopUp
     * @description function to close the popup
     */
    function closePopUp() {
        $.fancybox.close(true);
    }

    /**
     * @method openYouTubeEditorPopup
     * @description function to open the youtube editor popup
     * @param button - button object will be passed to find the current iframe
     * @ticket 511,BOMB-3233
     */
    function openYouTubeEditorPopUp(button) {
        currentYouTubeIframe = $(button).parents('.ROhandlers').siblings('.ROyoutubeContainer').find('iframe');
        var popupContent;
        if(currentYouTubeIframe.length===2){
            popupContent = $(youtubePopUpContentForTwoVideo);
            popupContent.find('.left .ROyouTuebeUrl input').val($(currentYouTubeIframe[0]).attr('src'));
            popupContent.find('.right .ROyouTuebeUrl input').val($(currentYouTubeIframe[1]).attr('src'));
            popupContent.find('.left .RO-old-src').html($(currentYouTubeIframe[0]).attr('src'));
            popupContent.find('.right .RO-old-src').html($(currentYouTubeIframe[1]).attr('src'));
        } else {
            popupContent = $(youtubePopUpContent);
            popupContent.find('.ROyouTuebeUrl input').val(currentYouTubeIframe.attr('src'));
            popupContent.find('.RO-old-src').html(currentYouTubeIframe.attr('src'));
        }
        openPopUp(popupContent);
        popupContent.find('.ROsavePopUp').click(saveYouTubeData);
        popupContent.find('.ROclosePopUp').click(closePopUp);
    }

    /**
     * @method saveYouTubeData
     * @description function to edit youtube data
     * @tickets: BOMB-3233
     */
    function saveYouTubeData() {
        if($('.ROyouTubeEditor .ROyouTuebeUrl input').length===1){
            var src = $('.ROyouTubeEditor .ROyouTuebeUrl input').val(),
                oldSrc = $('.ROyouTubeEditor .RO-old-src').html(),
                $messageContainer=$('.ROyouTubeEditor .RO-popup-message'),
                $iFrame=currentYouTubeIframe;
            if(_validateYouTubeLink(src,oldSrc,$messageContainer)){
                $iFrame.attr('src',src);
                closePopUp();
            }
        } else {
            var srcLeft = $('.ROyouTubeEditor .left .ROyouTuebeUrl input').val(),
                oldSrcLeft = $('.ROyouTubeEditor .left .RO-old-src').html(),
                $messageContainerLeft=$('.ROyouTubeEditor .left .RO-popup-message'),
                $iFrameLeft=$(currentYouTubeIframe[0]);
            if(_validateYouTubeLink(srcLeft,oldSrcLeft,$messageContainerLeft)){
                var srcRight = $('.ROyouTubeEditor .right .ROyouTuebeUrl input').val(),
                    oldSrcRight = $('.ROyouTubeEditor .right .RO-old-src').html(),
                    $messageContainerRight=$('.ROyouTubeEditor .right .RO-popup-message'),
                    $iFrameRight=$(currentYouTubeIframe[1]);
                if(_validateYouTubeLink(srcRight,oldSrcRight,$messageContainerRight)){
                    $iFrameLeft.attr('src', srcLeft);
                    $iFrameRight.attr('src', srcRight);
                    closePopUp();
                }
            }
        }
        /**
         * @method _validateYouTubeLink
         * @description function to validate the link
         * @param src
         * @param oldSrc
         * @param $messageContainer
         * @returns {boolean}
         * @tickets: BOMB-3233
         * @private
         */
        function _validateYouTubeLink(src,oldSrc,$messageContainer){
            var message = null;
            if (src.indexOf('http://') === 0) {
                message = 'URL must be https';
            } else if (src.indexOf('https://') !== 0) {
                message = 'Please enter valid URL';
            } else if (oldSrc.indexOf('https://www.youtube.com/embed/') === 0 && src.indexOf('https://www.youtube.com/embed/') !== 0) {
                message = 'Please enter the youtube embed url only';
            } else if (oldSrc.indexOf('https://www.google.com/maps/embed') === 0 && src.indexOf('https://www.google.com/maps/embed') !== 0) {
                message = 'Please enter the google maps embed url only';
            }
            $messageContainer.html(message);
            return !message; //if there is any validation message then return false, else true
        }
    }

    /**
     * Jqeury plugin for the Editor
     * @param activationConfig  - configuration to be set when the plugin is initiated
     */
    $.fn.ROContentEditor = function(activationConfig) {
        config = $.extend(config,activationConfig);
        activate();
        return {
            getHtml:getHtml,
            setHtml:setHtml
        };
    };
}( jQuery ));