# hebdomad
Hebdomad is a retunable webaudio instrument. It provides a quick web way to experiment with microtuning and explore xenharmonic music.

Hebdomad lives here: [http://brianginsburg.com/hebdomad/](http://brianginsburg.com/hebdomad/) 

The current version of the app uses JavaScript and jQuery, but it will be rewritten in some sweet JS framework in the future. 

### Deploy
Clone the repository then install the dependencies:
```
$ bower install
$ npm install
```

Browserify it:
```
$ browserify js/app.js -o js/bundle.js -d
```

### Run
It's static. Open `index.html` with Firefox or Chrome.

### License
Except where specified otherwise, all Hebdomad code is licensed under the [GNU Affero General Public License](https://github.com/thuselem/hebdomad/blob/master/LICENSE) as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
