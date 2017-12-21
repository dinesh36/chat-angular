(function(){
	'use strict';
	angular.module('HTAdminApp')
		.constant('HT_ERR_MESSAGE', {
			'COMMON_UNKNOWN_ERROR_FROM_API_SIDE':'Sorry, something went wrong. Please try again.'
		})
		//BOMB-1484
		.constant('US_STATES', [
			{name:'District OF Columbia', abbreviation:'DC'}, {name:'Delaware', abbreviation:'DE'},
			{name:'Florida', abbreviation:'FL'}, {name:'Georgia', abbreviation:'GA'},
			{name:'Maryland', abbreviation:'MD'}, {name:'North Carolina', abbreviation:'NC'},
			{name:'South Carolina', abbreviation:'SC'}, {name:'Virginia', abbreviation:'VA'}
		])
		.constant('NOTIFICATION_PLACEHOLDER', {
			'SOLICITATION_PLACEHOLDER':[
				{'key':1, 'name':'Event Type', 'value':'{event-type}'},
				{'key':2, 'name':'First Name', 'value':'{first-name}'},
				{'key':3, 'name':'Last Name', 'value':'{last-name}'},
				{'key':4, 'name':'Organization Name', 'value':'{organization-name}'},
				{'key':5, 'name':'Date Needed', 'value':'{date}'},
				{'key':6, 'name':'Start Time', 'value':'{start-time}'},
				{'key':7, 'name':'End Time', 'value':'{end-time}'},
				{'key':8, 'name':'Store Selection 1', 'value':'{store-selection-1}'},
				{'key':9, 'name':'Store Selection Address 1', 'value':'{store-selection-address-1}'},
				{'key':10, 'name':'Store Selection 2', 'value':'{store-selection-2}'},
				{'key':11, 'name':'Store Selection Address 2', 'value':'{store-selection-address-2}'},
				{'key':12, 'name':'Store Selection 3', 'value':'{store-selection-3}'},
				{'key':13, 'name':'Store Selection Address 3', 'value':'{store-selection-address-3}'},
				{'key':14, 'name':'Approved Store', 'value':'{approved-store}'},
				{'key':15, 'name':'Approved Store Address', 'value':'{approved-store-address}'}
			],
			'CONTRIBUTION_PLACEHOLDER':[
				{'key':1, 'name':'Request Type', 'value':'{request-type}'},
				{'key':2, 'name':'First Name', 'value':'{first-name}'},
				{'key':3, 'name':'Last Name', 'value':'{last-name}'},
				{'key':4, 'name':'Title', 'value':'{title}'},
				{'key':5, 'name':'Phone Number', 'value':'{phone-number}'},
				{'key':6, 'name':'Email', 'value':'{email}'},
				{'key':7, 'name':'Organization Name', 'value':'{organization-name}'},
				{'key':8, 'name':'Date Needed', 'value':'{date}'},
				{'key':9, 'name':'Request Description', 'value':'{request-description}'},
				{'key':10, 'name':'Tax ID #', 'value':'{tax-id}'}
			]
		})
		.constant('FROALA_OPTIONS', {
			key:'oGLGTI1DMJc1BWLg1PO==',
			height:170,
			imagePaste:false,
			pastePlain:true,
			entities: '',
			toolbarButtons:['bold', 'italic', 'underline', 'fontSize', 'formatOL', 'formatUL'],
			toolbarButtonsSM:['bold', 'italic', 'underline', 'fontSize', 'formatOL', 'formatUL'],
			toolbarButtonsMD:['bold', 'italic', 'underline', 'fontSize', 'formatOL', 'formatUL']
		})
		.constant('REGEX', {
			'EMAIL':/^[A-Z0-9_]([A-Z0-9._-]|)*@[A-Z0-9.-]+\.[A-Z]{2,4}$/i
		})
		.constant('GIFT_STATUSES', {
			'SignUpEmailSent':'Sign-up Email sent',
			'ExistingCustomer':'Existing Customer',
			'NewCustomer':'New Customer',
			'FutureGift':'Future Gift',
			'FutureExistingCustomer':'Future Existing Customer',
			'FinalizeAccountCreated':'Finalize - Account Created',
			'FinalizeSubscriptionAdded':'Finalize - Subscription Added',
			'FinalizeSubscriptionExtended':'Finalize - Subscription Extended'

		})
		.constant('MEDIA_TYPE', {
			MEDIA_ALERTS:0,
			PRODUCT_RECALL:1
		});
})();