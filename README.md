# jQuery Gender Field

A transgender friendly jQuery plugin for gender form fields. Collect semi-structured data from your forms.
You're probably already storing gender as a string, so why not allow your users to tell you more?

## Usage

```javascript
$(selector).genderField();
```
	
And that's it!

## Styling

`.genderField-dropdown` and `.genderField-dropdown span` can easily be styled using additional CSS.

## Additional Options

Pass an object into `$(selector).genderField()` to add additional genders or turn off the background arrow image.
e.g.

```javascript
$(selector).genderField({showArrow:false, additionalGenders: ['third gender','none']);
```


