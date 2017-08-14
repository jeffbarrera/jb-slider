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

### Moving the slider

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

One of the cleanest ways to show and hide the slides in CSS is to set `position: relative; overflow: hidden;` on the slider wrapper, and then absolutely position the slides within the wrapper. However, this approach requires setting an explicit height on the wrapper, or else the wrapper height will be set to zero and the slides will be hidden. To address this, the plugin calculates the height (including margins) of the active slide, and sets this as the height of the wrapper element. 

If `monitorHeightChanges` is set to `true`, the slider also listens for changes in the height of the slides (in case there's an expanding field on the slide, for example) and updates the wrapper height as needed, using the event-based [javascript-detect-element-resize](https://github.com/sdecima/javascript-detect-element-resize) plugin (included as a dependency when using Bower).

## Options

These options can be passed into the `new JBSlider()` constructor:

```javascript

slider = new JBSlider({
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
});

```

### wrapperSelector

Type: `String`

Default: `.slider`

A CSS selector for the slider's wrapper element. Must be a string that can be passed into `document.querySelector();`. This should be a unique selector, otherwise only the first matching element will be used. To create multiple sliders on the same page, use two different selectors.

### slideSelector

Type: `String`

Default: `.slider__slide`

A CSS selector for the slide elements. Must be a string that can be passed into `sliderWrapper.querySelectorAll(); `.

### activeClass

Type: `String`

Default: `slider__slide--active`

The class that should be applied to the active slide. Style this to be visible using CSS.

### inactiveClass

Type: `String`

Default: `slider__slide--inactive`

The class that should be applied to the inactive slides. Style this to be hidden using CSS.

### prevClass

Type: `String`

Default: `slider__slide--prev`

The class that should be applied to slides that occur before the active slide. Use this to animate the slides off to the left using CSS, for example.

### nextClass

Type: `String`

Default: `slider__slide--next`

The class that should be applied to slides that occur after the active slide. Use this to animate the slides off to the right using CSS, for example.

### navWrapperSelector

Type: `String`

Default: `null`

A CSS selector for a slider navigation wrapper element. If set to `null`, no slider nav event listeners will be created. Must be a string that can be passed into `document.querySelector();`. This should be a unique selector, otherwise only the first matching element will be used.

### navItemSelector

Type: `String`

Default: `null`

A CSS selector for the slide navigation elements.  If set to `null`, no slider nav event listeners will be created. Must be a string that can be passed into `wrapper.querySelectorAll();`.

### navActiveClass

Type: `String`

Default: `null`

A class to be applied to the slider nav element that corresponds to the active slide. Use this to style the slider nav element.

TKTK see if this breaks if navItemSelector is set but this is null.

### navVisitedClass

Type: `String`

Default: `null`

A class to be applied to slider nav elements that have already been visited. Useful for showing progress through a tabbed form, for example.

### navForVisitedSlidesOnly

Type: `Boolean`

Default: `false`

If set to `true`, only slider nav elements that have the `navVisitedClass` will be able to move the slider. Useful if you only want people to be able to go back to form tabs that have already been validated, for example.

### monitorHeightChanges

Type: `Boolean`

Default: `true`

The slider sets the height of the wrapper based on the height of the active slide. This is helpful if the slides are absolutely positioned within a wrapper with `overflow: hidden;` set (see the [updating height section above](#updating-height) for more info).

If this option is set to `true`, the slider will use the event-based [javascript-detect-element-resize](https://github.com/sdecima/javascript-detect-element-resize) plugin to watch for changes in the slide's height, and update the wrapper height as needed.

### eventsOnSlideChange

Type: `Boolean`

Default: `false`

If set to `true`, the plugin will dispatch custom "slideChange" events whenever a new slide becomes active. You can add an event listener to react to these events as desired. The event details include the indicies of the previously active slide and the newly active slide:

```javascript

detail: {
	prevSlideIndex: 0,
	newSlideIndex: 1
}

```

## Public Methods

### advanceSlide()

Arguments: None

Returns: None

Moves forward one slide, provided there is a future slide.

```javascript

slider.retreatSlide();

```

### retreatSlide()

Arguments: None

Returns: None

Moves back one slide, provided there is a previous slide.

```javascript

slider.retreatSlide();

```

### goToSlide(slide_index)

Arguments: The index of the slide to go to.

Returns: None

Moves to the slide with the specified index (starting at zero).

```javascript

slider.goToSlide(1);

```

### Element references

You can access slider elements as follows:

```javascript

slider.sliderWrapper; # the wrapper element
slider.slides; # an array of slide elements
slider.activeSlide; # the index of the current slide (starting at zero)
slider.options; # any of the options

# if navWrapperSelector and navItemSelector are both not null:
slider.navWrapper; # the nav wrapper element
slider.navItems; # an array of nav elements

```














