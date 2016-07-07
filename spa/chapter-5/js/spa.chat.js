
/**
 * spa.chat.js
 * chat feature module for spa
 */

//global $, spa
spa.chat = (function  () {  //创建该模块的命名空间spa.chat
	
	//----------------Begin Moudle scope varlables
	//beigin module scope variavles
	var configMap = {

		//将聊天滑块的html模版保存在configMap中
		//请随意使用自己的模版开替换这条消息
		main_html: String()
			+ '<div class="spa-chat">'
				+'<div class="spa-chat-head">'
			    +'<div class="spa-chat-head-toggle">+</div>'
			    +'<div class="spa-chat-head-title">'
			      +'chat'
			    +'</div>'
			   +'</div>'
			   +'<div class="spa-chat-closer">x</div>'
			   +'<div class="spa-chat-sizer">'
			    +'<div class="spa-chat-msgs"></div>'
			    +'<div class="spa-chat-box">'
			     +'<input type="text" />'
			     +'<div>speed</div>'
			    +'</div>'
			   +'</div>'
			  +'</div>',

		settable_map: {
			slider_open_time: true,
			slider_close_time: true,
			slider_opened_em: true,
			slider_closed_em: true,
			slider_opened_title: true,
			slider_closed_title: true,

			chat_model: true,
			people_model: true,
			set_chat_anchor: true 
		},

		slider_open_time: 250,
		slider_close_time: 250,
		slider_opened_em: 18,
		slider_closed_em: 2,
		slider_opened_min_em: 10,
		window_height_min_em: 20,
		slider_opened_title: 'click to close',
		slider_closed_title: 'click to open',

		chat_model: null,
		people_model: null,
		set_chat_anchor: null
	},

	stateMap = {
		$container: null,
		position_type: 'closed',
		px_per_em: 0,
		slider_hidden_px: 0,
		slider_closed_px: 0,
		slider_opened_px: 0
	},

	jqueryMap = {},

	setJqueryMap, getEmSize, setPxSizes, setSliderPosition, onClickToggle,
	configModule, initModule, removeSlider, handleResize;

	//gegin utility methods
	getEmSize = function  (elem) {

		//添加getEmSize方法，把em显示单位转换为像素，
		//这样就可以使用jquery的度量式了
		return Number(
			getComputedStyle(elem, '').fontSize.match(/\d*\.?\d*/)[0]
		)
	}

	//begin dom methods
	setJqueryMap = function  () {
		var $append_target = stateMap.$append_target,
		$slider = $append_target.find('.spa-chat');

		jqueryMap = {
			$slider: $slider, 
			$head: $slider.find('.spa-chat-head'),
			$toggle: $slider.find('.spa-chat-head-toggle'),
			$title: $slider.find('.spa-chat-head-title'),
			$sizer: $slider.find('.spa-chat-sizer'),
			$msgs: $slider.find('.spa-chat-msgs'),
			$box: $slider.find('.spa-chat-box'),
			$input: $slider.find('.spa-chat-input input[type=text]')
		};
	};

	//begin dom method /setPxSizes
	setPxSizes = function  () {
		var px_per_em, window_height_em, opened_height_em;
		px_per_em = getEmSize(jqueryMap.$slider.get(0));

		window_height_em = Math.floor(
			($(window).height() / px_per_em) + 0.5
		);

		opened_height_em = window_height_em > configMap.window_height_min_em
		? configMap.slider_opened_em : configMap.slider_opened_min_em;

		stateMap.px_per_em = px_per_em;
		stateMap.slider_closed_px = configMap.slider_closed_em * px_per_em;
		stateMap.slider_opened_px = opened_height_em * px_per_em;
		jqueryMap.$sizer.css({
			height: (opened_height_em - 2) * px_per_em
		})
	}


	//begin public method handleResize
	handleResize = function  () {
		
		//don't do anything if we don't have a slider container
		if (!jqueryMap.$slider) {
			return false;
		}

		setPxSizes();

		if (stateMap.position_type === 'opened') {
			jqueryMap.$slider.css({height: stateMap.slider_opened_px});
		}


		//如果滑块是展开的，在窗口尺寸调整期间，确保把滑块高度设置为
		//setPxSizes计算得到的值
		
		return true;
	}


	setSliderPosition = function  (position_type, callback) {
		var height_px, animate_time, slider_title, toggle_text;

		//return true if slider already in requested position
		if (stateMap.position_type === position_type) {
			return true;
		}

		//prepare animate parameters
		switch (position_type) {
			case 'opened': 
			  height_px = stateMap.slider_opened_px;
			  animate_time = configMap.slider_open_time;
			  slider_title = configMap.slider_opened_title;
			  toggle_text = '=';
			break;

			case 'hidden':
			   height_px = 0;
			   animate_time = configMap.slider_open_time;
			   slider_title = '';
			   toggle_text: '+';
			break;

			case 'closed': 
				height_px = stateMap.slider_closed_px;
				animate_time = configMap.slider_closed_time;
				slider_title = configMap.slider_closed_title;
				toggle_text = "+";
			break;

			//bail for  unknown position_type
			default: return false;
		}

		//animate slider position change
		stateMap.position_type = '';
		jqueryMap.$slider.animate(
			{height: height_px},
			animate_time,
			function  () {
				jqueryMap.$toggle.prop('title', slider_title);
				jqueryMap.$toggle.text(toggle_text);
				stateMap.position_type = position_type;
				if (callback) { callback(jqueryMap.$slider); }
		})
		return true;
	}

	//begin event handlers
	onClickToggle = function  (event) {
		var set_chat_anchor = configMap.set_chat_anchor;
		if (stateMap.position_type === 'opened') {
			set_chat_anchor('closed');
		}
		else if (stateMap.position_type === 'closed') {
			set_chat_anchor('opened');
		}

		return false;
	}

	configModule = function  (input_map) {
		spa.util.setConfigMap({
			input_map: input_map,
			settable_map: configMap.settable_map,
			config_map: configMap
		});
		return true;
	};

	removeSlider = function  () {
		
		//unwind initialzation and state
		//remove DOM container;this removes event bindings too
		if(jqueryMap.$slider) {
			jqueryMap.$slider.remove();
			jqueryMap = {};
		}

		stateMap.$append_target = null;
		stateMap.position_type = 'closed';

		//unwind key configurations
		configMap.chat_model = null;
		configMap.people_model = null;
		configMap.set_chat_anchor = null;

		return true;
	}

	//使用html模版填充聊天滑块容器
	//写到这里
	initModule = function  ($append_target) {
		$append_target.append(configMap.main_html);
		stateMap.$append_target = $append_target;
		setJqueryMap();
		setPxSizes();


		//initialize chat slider to default title and state
		jqueryMap.$toggle.prop('title', configMap.slider_closed_title);
		jqueryMap.$head.click(onClickToggle);
		stateMap.position_type = 'closed';

		return true;
	};



	//return public methods
	//导出模块方法configModule和initModule,
	//这两个方法几乎是所有功能模块的标配方法
	return {
		setSliderPosition: setSliderPosition,
		configModule: configModule,
		initModule: initModule,
		removeSlider: removeSlider,
		handleResize: handleResize
	};
}());
