/**
 * this is the base game class
 *
 * Copyright (C) 2008 Nikolay V. Nemshilov aka St. <nemshilov-gmail-com>
 */
var JSMiner = new Class({
  // the basic element attribute
  element: null,
  
  // main elements attributes
  field: null,
  timer: null,
  score: null,
  smile: null,
  
  // the game-logic object 
  game: null,
  
  /**
   * constructor
   *
   * @param Element the base game element
   * @param Object options, optional pointers to the main 
   *        game containers. field, timer, score, smile
   * @return void
   */
  initialize: function(element, options) {
    var options = options || {};
    
    this.element = $(element);
    
    if (!this.element) { throw "Element is not found"; }
    
    // checking the basic elements location 
    ['field', 'timer', 'score', 'smile'].each(function(name) {
      if (options[name]) {
        this[name] = $(options[name]);
      } else {
        var child = this.element.getFirst('div#'+name);
        if (child) {
          this[name] = child;
        }
      }
    }, this);
    
    this.game = new JSMiner.Game();
    
    this.setSize(options['rows'], options['cols']);
  },
  
  /**
   * sets the field size
   *
   * @param Integer rows number
   * @param Integer cols number
   * @return JSMiner self instance
   */
  setSize: function(rows, cols) {
    this.game.setSize(rows, cols)
    
    this.rebuild();
    
    return this;
  },
  
  /**
   * resets the state attributes
   *
   * @return JSMiner self instance
   */
  reset: function() {
    this.game.reset();
    this.rebuild();
    
    return this;
  },
  
  /**
   * rebuilds the game UI
   *
   * @return JSMiner self instance
   */
  rebuild: function() {
    
    return this;
  }
});