/* JB Slider
===========
Lightweight, vanilla JS slider plugin.
============
Author: Jeff Barrera, jeffbarrera.com
*/

; // defensive programming

(function() {

	this.JBSlider = function() {

		// Define option defaults
		this.options = {
			wrapperSelector: '.slider',
			slideSelector: '.slider__slide',
			activeClass: 'slider__slide--active',
			inactiveClass: 'slider__slide--inactive',
			prevClass: 'slider__slide--prev',
			nextClass: 'slider__slide--next',
			navWrapperSelector: null,
			navItemSelector: null,
			navActiveClass: null,
			navVisitedClass: null,
			navForVisitedSlidesOnly: false,
			monitorHeightChanges: true,
			eventsOnSlideChange: false
		}

		// Create options by extending defaults with the passed in arugments
		if (arguments[0] && typeof arguments[0] === "object") {
			this.options = extendDefaults(this.options, arguments[0]);
		}

		// Create element references
		this.sliderWrapper = document.querySelector(this.options.wrapperSelector);
		this.slides = this.sliderWrapper.querySelectorAll(this.options.slideSelector);
		this.activeSlide = 0;

		// create nav references as needed
		if(this.options.navWrapperSelector && this.options.navItemSelector) {
			this.navWrapper = document.querySelector(this.options.navWrapperSelector);
			this.navItems = this.navWrapper.querySelectorAll(this.options.navItemSelector);
		}

		// initialize listeners
		moveSliderOnNavClick.call(this);

		// initialize slider
		this.goToSlide(0);

		// initialize height change listeners
		if (this.options.monitorHeightChanges) {
			adjustForHeightChanges.call(this);
		}
	}

	/*****
	Public Methods
	*****/

	/* goToSlide
	============
	Move the slider to a specific slide.
	Calls the internal private method
	*/
	JBSlider.prototype.goToSlide = function(toIndex) {

		var prevSlideIndex = this.activeSlide; // for use in slideChange event

		privateGoToSlide.call(this, toIndex);
		updateSliderNav.call(this, toIndex);
		this.activeSlide = toIndex;

		// dispatch event if eventsOnSlideChange is true
		if (this.options.eventsOnSlideChange) {
			var event = new CustomEvent(
				"slideChange",
				{
					detail: {
						prevSlideIndex: prevSlideIndex,
						newSlideIndex: toIndex,
					},
					bubbles: true,
					cancelable: true
				});

			this.sliderWrapper.dispatchEvent(event);
		}
	}

	/* advanceSlide
	===============
	Move the slider to the next slide (if there is a next slide).
	*/
	JBSlider.prototype.advanceSlide = function() {
		var toIndex = this.activeSlide + 1;
		
		if (toIndex < this.slides.length) { 
			this.goToSlide(toIndex);
		}
	}

	/* retreatSlide
	===============
	Move the slider to the previous slide (if there is a previous slide).
	*/
	JBSlider.prototype.retreatSlide = function() {
		var toIndex = this.activeSlide - 1;

		if (toIndex >= 0) { 
			this.goToSlide(toIndex);
		}
	}

	/*****
	Private Methods
	*****/

	/* extendDefaults
	=================
	Override default options with user input.
	*/
	function extendDefaults(defaults, userSettings) {
		var setting;
		for (setting in userSettings) {
			if (userSettings.hasOwnProperty(setting)) {
				defaults[setting] = userSettings[setting];
			}
		}
		return defaults;
	}



	/* privateGoToSlide
	===================
	Move the slider to the slide with the specified index.
	*/
	function privateGoToSlide(toIndex) {
		
		for(var i=0; i<this.slides.length; i++) {

			var currentSlide = this.slides[i];

			if (i < toIndex) { // previous slide

				// set classes
				currentSlide.classList.remove(this.options.activeClass, this.options.nextClass);
				currentSlide.classList.add(this.options.inactiveClass, this.options.prevClass);

				// prevent tabbing from triggering this slide
				setTabIndex.call(this, currentSlide, "-1");
			
			} else if (i == toIndex) { // active slide

				// update the slider wrapper height
				updateHeight.call(this, currentSlide);

				// set classes
				currentSlide.classList.remove(this.options.inactiveClass, this.options.prevClass, this.options.nextClass);
				currentSlide.classList.add(this.options.activeClass);

				// activate tabbing on elements on this slide
				setTabIndex.call(this, currentSlide, "0");

			} else if (i > toIndex) { // future slide

				// set classes
				currentSlide.classList.remove(this.options.activeClass, this.options.prevClass);
				currentSlide.classList.add(this.options.inactiveClass, this.options.nextClass);

				// prevent tabbing from triggering this slide
				setTabIndex.call(this, currentSlide, "-1");
			}
		}
	}



	/* setTabIndex
	==================
	Set the tabindex for all tabbable elements on the slide
	to the tabindex_value parameter, to prevent elements on 
	inactive slides from being tabbed to.
	*/
	function setTabIndex(currentSlide, tabindex_value) {
		
		// get all tabbable elements
		var tabbable_elements = currentSlide.querySelectorAll('input, select, textarea, button, object');
		
		// loop over the elements, set the tabindex to tabindex_value
		for (var i=0; i<tabbable_elements.length; i++) {
			var element = tabbable_elements[i];
			element.tabIndex = tabindex_value;
		}
	}



	/* updateSliderNav
	==================
	Update the slider nav classes
	*/
	function updateSliderNav(toIndex) {

		if (!this.options.navWrapperSelector) {
			return; // no nav item has been specified
		}

		for (var i=0; i<this.navItems.length; i++) {

			var currentNavItem = this.navItems[i];

			if (i < toIndex) { // previous item
				currentNavItem.classList.remove(this.options.navActiveClass);
				currentNavItem.classList.add(this.options.navVisitedClass);
			
			} else if (i == toIndex) { // active item

				currentNavItem.classList.add(this.options.navActiveClass, this.options.navVisitedClass);
			
			} else if (i > toIndex) { // next item
				currentNavItem.classList.remove(this.options.navActiveClass);
			}
		}
	}



	/* moveSliderOnNavClick
	=======================
	Listen for clicks on the nav items, use the data attribute
	to move the slider.
	*/
	function moveSliderOnNavClick() {
		
		if (!this.options.navWrapperSelector) {return;} // no nav item has been specified

		// add event listeners to all the nav items
		for (var i=0; i<this.navItems.length; i++) {

			var _ = this; // store scope for use inside the event listener

			_.navItems[i].addEventListener('click', function(event) {
				event.preventDefault();
				var linkedSlide = parseInt(this.getAttribute('data-slide-step'));

				// if navForVisitedSlidesOnly is true, only move if the nav item has a visited class
				if (_.options.navForVisitedSlidesOnly) {
					if (this.classList.contains(_.options.navVisitedClass)) {
						_.goToSlide(linkedSlide);
					}
				} else {
					_.goToSlide(linkedSlide);
				}
			});
		}
	}



	/* adjustForHeightChanges
	=========================
	Listen for changes in the slide heights,
	call update height if the height changes.
	*/
	function adjustForHeightChanges() {
		for (var i=0; i<this.slides.length; i++) {
			var slide = this.slides[i];
			var _ = this;
			addResizeListener(slide, function(){
				updateHeight.call(_, _.slides[_.activeSlide]);
			});
		}
	}



	/* updateHeight
	===============
	Given a slide object, update the slider wrapper height.
	Needed because the slides are absolutely positioned.
	*/
	function updateHeight(activeSlide) {
		var slideHeight = activeSlide.offsetHeight;
		var style = getComputedStyle(activeSlide);
		slideHeight += parseInt(style.marginTop) + parseInt(style.marginBottom);

		// update wrapper height
		this.sliderWrapper.style.height = slideHeight+'px';
	}

}());