(function($) {
	let _sliderObj = {},
			_bannerApiObj = {}
	_sliderObj.index = 0,
	_sliderObj.interval = 6000,
	_bannerApiObj.area01_slider = 'data/slider.json'
	$(function() {
		getSliderData()
	})

	function getSliderData() {
		// slider
		$.ajax({
      type: 'get',
      url: _bannerApiObj.area01_slider,
      dataType: 'json'
    })
    .done(function(data) {
      setSlider(data.data)
    })
    .fail(function(err) {
      console.log('err = ', err)
		})
	}

	function setSlider(data) {
		// 取得 list 的字串
		let sliderListHtml = data.map(function(data) {
			return `
				<li class="${data.ga}" megais_ga="${data.ga}">
					<a class="btn1 btn1-hover b-1" target="_blank" href="http://www.levis.com.tw/v2/official/SalePageCategory/211090">MEN</a>
					<a class="btn1 btn1-hover b-2" target="_blank" href="http://www.levis.com.tw/v2/official/SalePageCategory/211103">WOMEN</a>
					<a target="${data.target}" href="${data.link}">
						<img src="${data.img}" />
					</a>
				</li>
			`
		}).join('')

		// 取得 dot 的字串
		let sliderDotListHtml = data.map(function(data) {
			return `
				<li>
					${data.title}
				</li>
			`
		}).join('')

		// 組成 slider 的內容
		let sliderHtml = `
			<ul class="slider-cont">
				${sliderListHtml}
			</ul>
			<ul class="dotNav">
				${sliderDotListHtml}
			</ul>
		`

		$('.slider').html(sliderHtml)


		_sliderObj.imgLength = $('.slider .slider-cont li').length

		let $slider = $('.slider')
		let $sliderCont = $('.slider .slider-cont')
		let $dotNav, $dotNavLi

		$dotNav = $slider.find('.dotNav')
		$dotNavLi = $dotNav.find('li')

		$sliderCont.find('li').eq(0).addClass('active')
		$dotNav.find('li').eq(0).addClass('active')

		sliderTimer()
		
		$dotNavLi.on('click', function() {
			let $this = $(this)
			let newiIndex = $this.index()
			let oldIndex = $('.slider .dotNav li.active').index()
			let changeNum = newiIndex - oldIndex

			if ($this.hasClass('active')) return

			// handlePauseVideo()
			changeSlide(changeNum)
			sliderTimer()
		})

		setSliderDotNav()
	}

	function setSliderDotNav() {
		// 調整dotNav位置
		var sliderHight = 530;
		var sliderLiLength = $('.dotNav li').length;
		var sliderLiHeight = 35;
		var sliderLiMarginTop = 8;
		var dotNavHeight = (sliderLiHeight + sliderLiMarginTop) * sliderLiLength - sliderLiMarginTop;

		$('.dotNav').css({
			top: (sliderHight - dotNavHeight) / 2
		});
	}

	function sliderChangeToNext() {
		changeSlide(1)
	}

	function changeSlide(pPlus) {
    let $imgLi = $('.slider .slider-cont li')
    let $dotNavLi = $('.slider .dotNav li')
    let oldIndex = _sliderObj.index;
    _sliderObj.index += pPlus;
    // index的範圍
    if (_sliderObj.index >= _sliderObj.imgLength) {
      _sliderObj.index = 0
    }
    if (_sliderObj.index < 0) {
      _sliderObj.index = _sliderObj.imgLength - 1
    }

    // console.log('oldIndex = ', oldIndex);
    // console.log('index = ', _sliderObj.index);

    // $imgLi.eq(_sliderObj.index).addClass('active').siblings().removeClass('active')
    $dotNavLi.eq(_sliderObj.index).addClass('active').siblings().removeClass('active')

    if (pPlus > 0) {
      handleAnimateCss($imgLi.eq(_sliderObj.index), 'slideInRight', true);
      handleAnimateCss($imgLi.eq(oldIndex), 'slideOutLeft');
    } else {
      handleAnimateCss($imgLi.eq(_sliderObj.index), 'slideInLeft', true);
      handleAnimateCss($imgLi.eq(oldIndex), 'slideOutRight');
    }

    // var youtubeId = $imgLi.eq(_sliderObj.index).attr('youtubeid');
		//
    // if (youtubeId) {
    //   if ($imgLi.eq(_sliderObj.index).find('#youtube').length > 0) return
    //   console.log('youtubeId = ', youtubeId);
    //   changeYoutube(youtubeId);
    // } else {
    //   handlePauseVideo()
    // }
	}
	
	function handleAnimateCss(pEle, animationName, pBol) {
    var bol = pBol || false
    var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend'
    // console.log('1. ', bol)

    if (bol) {
      if (pEle.hasClass('video-cont')) {
        pEle.off(animationEnd).addClass('video-cont')
      } else {
        pEle.off(animationEnd)
      }

      pEle.addClass('active')
    }

    pEle.addClass('animated ' + animationName).one(animationEnd, function() {
      // console.log('2. ', bol)
      pEle.removeClass('animated ' + animationName)
      if (!bol) {
        pEle.removeClass('active')
      }
    });
	}
	
	function sliderTimer() {
		clearInterval(_sliderObj.timer)
		_sliderObj.timer = setInterval(sliderChangeToNext, _sliderObj.interval)
	}
})(jQuery)
