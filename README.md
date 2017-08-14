# jb-slider

A lightweight, vanilla javascript slider plugin. This simply adds/removes element classes as needed, letting you specify the design, animation, etc of the slides as desired with CSS.

## Usage

### Initialize a new slider

```javascript

slider = new JBSlider({
	wrapperSelector: '.slider',
	navWrapperSelector: '.slider-nav',
	navItemSelector: '.slider-nav__step',
	navActiveClass: 'slider-nav__step--active',
	navVisitedClass: 'slider-nav__step--completed',
});

```

See below for the full list of options that can be passed in, and the defaults. Multiple sliders can be used on the same page provided they each have a different `wrapperSelector` and (if used) `navWrapperSelector`.

### Public Methods

```javascript

# go to the next slide
slider.advanceSlide();

# go the the previous slide
slider.retreatSlide();

# go to a specific slide
slider.goToSlide(1);

```

### Using slider navigation

If you pass in CSS selectors for `navWrapperSelector` and `navItemSelector`, the slider will listen for click events on the nav items and move the slider appropriately. Use a `data-slide-step` attribute to associate the nav item with the index of the connected slide (to degrade gracefully if javascript is disabled, I recommend making the nav items links to anchor IDs on the slides). For example:

```html

<nav class="progress-indicator" id="staged_donate_slider_nav">
  <ul>
    <li>
      <a href="#amount" class="progress-indicator__step" data-slide-step="0">Amount</a>
    </li>
    <li>
      <a href="#info" class="progress-indicator__step" data-slide-step="1">Your Info</a>
    </li>
    <li>
      <a href="#payment" class="progress-indicator__step" data-slide-step="2">Payment</a>  
    </li>
  </ul>
</nav>

```

### Updating height

One of the cleanest ways to show and hide the slides in CSS is to set `position: relative; overflow: hidden;` on the slider wrapper, and then absolutely position the slides within the wrapper. However, this approach requires setting an explicit height on the wrapper, or else the wrapper height will be set to zero and the slides will be hidden.

To address this, the plugin calculates the height (including margins) of the active slide, and sets this as the height of the wrapper element. The slider also listens for changes in the height of the slides (in case there's an expanding field on the slide, for example) and updates the wrapper height as needed, using the event-based [javascript-detect-element-resize](https://github.com/sdecima/javascript-detect-element-resize) plugin (included as a dependency when using Bower).

This behavior can be disable by setting `monitorHeightChanges: false` in the slider options.

### Slide change events

By setting `eventsOnSlideChange: true` in the slider options, the plugin will dispatch custom "slideChange" events whenever a new slide becomes active. You can add an event listener to react to these events as desired. The event details include the indicies of the previously active slide, and the newly active slide:

```javascript

detail: {
	prevSlideIndex: 0,
	newSlideIndex: 1
}

```
