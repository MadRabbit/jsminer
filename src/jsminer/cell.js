/**
 * this class presents a field-cell unit
 *
 * Copyright (C) 2008 Nikolay V. Nemshilov aka St. <nemshilov-gmail-com>
 */
JSMiner.Cell = new Class({
  element: null,
  
  mined: null,
  marked: null,
  nearMinesNum: null,
  
  game: null,
  top: null,
  left: null,
  
  /**
   * constructor
   *
   * @param JSMiner.Game game logic
   * @param Integer top position
   * @param Integer left position
   * @return void
   */
  initialize: function(game, top, left) {
    this.game = game;
    this.top = top;
    this.left = left;
    
    this.element = new Element('div', {
      'events': { click: this.onclick.bindWithEvent(this) }
    });
    
    this.reset();
  },
  
  /**
   * resets the cell state
   *
   * @return void
   */
  reset: function() {
    this.mined = false;
    this.marked = false;
    this.nearMinesNum = 0;
    this.element.className = 'cell';
  },
  
  /**
   * handles the onclick envent on the cell
   *
   * @param Event event
   * @return void
   */
  onclick: function(event) {
  },
  
  /**
   * puts a user's 'mined' mark on the cell
   *
   * @return void
   */
  mark: function() {
    this.element.toggleClass('marked');
    this.marked = ! this.marked;
  }
});