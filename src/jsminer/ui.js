/**
 * this is the user-interface building object
 *
 * Copyright (C) 2008 Nikolay V. Nemshilov aka St. <nemshilov-gmail-com>
 */
JSMiner.UI = new Class({
  controller: null,
  opts: null,
  
  /**
   * constructor
   *
   * @param JSMiner the game controller reference
   * @return void
   */
  initialize: function(controller) {
    this.controller = controller;
    this.opts = controller.opts;
  },
  
  /**
   * builds up the ui
   *
   * @return void
   */
  build: function() {
    if (this.opts.fieldElement) {
      this.buildField(this.opts.fieldElement, this.controller.getMinesMap());
    }
    if (this.opts.scoreElement) {
      this.updateScore(0);
    }
    if (this.opts.timerElement) {
      this.controller.game.updateTimerCallback = this.updateTimer.bind(this);
      this.updateTimer(0);
    }
    if (this.opts.smileElement) {
      this.opts.smileElement.onclick = this.controller.reset.bind(this.controller);
      this.updateSmile();
    }
  },
  
  /**
   * updates the elements states
   *
   * @params JSMiner.Cell last hit cell
   * @return void
   */
  update: function(last_cell) {
    if (this.opts.fieldElement) {
      var markers_num = this.updateField(this.controller.getMinesMap());
      if (this.opts.scoreElement) {
        this.updateScore(markers_num);
      }
    }
    if (this.opts.timerElement) {
      this.updateTimer(this.controller.game.timer);
    }
    if (this.opts.smileElement) {
      this.updateSmile();
    }
    if (this.controller.game.over) {
      if (!this.finalSalutPlayed) {
        this.showFinalSalut(last_cell);
      }
    } else {
      this.finalSalutPlayed = false;
    }
  },
  
  /**
   * updates the smile icon class
   *
   * @return void
   */
  updateSmile: function() {
    var class_name = '';
    if (this.controller.active()) {
      class_name = 'active';
    } else if (this.controller.paused()) {
      class_name = 'paused';
    } else if (this.controller.failed()) {
      class_name = 'failed';
    } else if (this.controller.won()) {
      class_name = 'won';
    }
    this.opts.smileElement.className = 'jsminer-smile '+class_name;
  },
  
  /**
   * updates the game timer
   *
   * @return void
   */
  updateTimer: function(time) {
    var hours = Math.floor(time/3600);
    var minutes = Math.floor(time/60%60);
    var seconds = time % 60;
    this.opts.timerElement.innerHTML = '' +
      (hours < 10 ? '0':'')   + hours + ':' +
      (minutes < 10 ? '0':'') + minutes  + ':' +
      (seconds < 10 ? '0':'') + seconds ;
  },
  
  /**
   * updates the current score field
   *
   * @param Integer mined-markers number
   * @return void
   */
  updateScore: function(markers_num) {
    this.opts.scoreElement.innerHTML = ''+
      markers_num + '/' +
      this.controller.getMinesNum();
  },
  
  /**
   * handles the mines-field update
   *
   * @param Array field map
   * @return Integer the mined-markers number
   */
  updateField: function(map) {
    this.updateFieldStyle();
    
    var markers_num = 0;
    for (var i=0; i < map.length; i++) {
      for (var j=0; j < map[i].length; j++) {
        this.updateCell(map[i][j]);
        if (map[i][j].marked) {
          markers_num ++;
        }
      }
    }
    return markers_num;
  },
  
  /**
   * handles a single cell updating
   *
   * @param JSMiner.Cell cell
   * @return void
   */
  updateCell: function(cell) {
    var class_name = '';
    cell.element.innerHTML = '';
    if (cell.explored) {
      if (cell.boomed) {
        class_name = 'boomed';
      } else if (cell.mined) {
        class_name = cell.marked ? 'marked' : 'mined';
      } else if (cell.markedWrong) {
        class_name = 'marked-wrong';
      } else {
        class_name = 'near-mines-'+cell.nearMinesNum;
        cell.element.innerHTML = cell.nearMinesNum == 0 ? ' ' : cell.nearMinesNum;
      }
      cell.element.addClass(class_name);
    } else if (cell.marked) {
      class_name = 'marked';
    }
    cell.element.className = 'cell '+class_name;
  },
  
  /**
   * updates the whole field related styles
   *
   * @return void
   */
  updateFieldStyle: function() {
    var block_size = this.opts.getBlockSize();
    this.opts.fieldElement[block_size=='big' ? 'addClass' : 'removeClass']('big-blocks');
    this.opts.fieldElement[block_size=='small' ? 'addClass' : 'removeClass']('small-blocks');
    
    // updating the rows width so the cells were not folding down
    var row_width = (this.opts.fieldElement.getFirst('div.row'
      ).getFirst('div.cell').offsetWidth * this.opts.getSize()[0]) + 'px';
    this.opts.fieldElement.getChildren('div.row').each(function(row) {
      row.style.width = row_width;
    });
  },
  
  /**
   * builds up the mines field area
   *
   * @param Element element
   * @param Array mines map
   * @return void
   */
  buildField: function(element, map) {
    element.innerHTML = '';
    
    for (var i=0; i < map.length; i++) {
      var row = new Element('div', { 'class': 'row' });
      for (var j=0; j < map[i].length; j++) {
        row.appendChild(this.buildCell(map[i][j]));
      }
      element.appendChild(row);
    }
    
    element.addClass('jsminer-field');
    
    this.updateFieldStyle();
  },
  
  /**
   * builds the field cell element
   *
   * @param JSMiner.Cell cell reference
   * @return Element the cell element
   */
  buildCell: function(cell) {
    cell.element = new Element('div', {
      'class': 'cell',
      'events': {
        'click':       this.handleCellClick.bindWithEvent(this,[cell]),
        'contextmenu': this.handleCellContextClick.bindWithEvent(this,[cell])
      }
    });
        
    return cell.element;
  },
  
  /**
   * the cell clicks common handler
   *
   * @param Event event (mootools event)
   * @param JSMiner.Cell cell
   * @return void
   */
  handleCellClick: function(event, cell) {
    event.stop();
    var button = event.event['which'] ? event.event.which : 1;
    if (event.shift || event.control || event.meta || button != 1) {
      this.controller.markCell(cell);
    } else {
      this.controller.hitCell(cell);
    }
  },
  
  // IE contextmenu catchup
  handleCellContextClick: function(event, cell) {
    if (navigator.userAgent.indexOf("MSIE") != -1) {
      event.event['which'] = 3;
    }
    this.handleCellClick(event, cell);
  },
  
  /**
   * this initiates a final show-off some visual effects
   * say the game is over
   *
   * @param JSMiner.Cell last hit cell
   * @return void
   */
  showFinalSalut: function(last_cell) {
    var show_class = this.controller.failed() ? 'boomed' : 'marked';
    var map = this.controller.getMinesMap();
    
    // the effect parameters
    var effect_duration = 400;
    var effect_width = 1.2;
    
    // calculating the distance which the effect should pass
    var x_distance = last_cell.left > map[0].length/2 ? last_cell.left+1 : Math.round(map[0].length/2);
    var y_distance = last_cell.top > map.length/2 ? last_cell.top+1 : Math.round(map.length/2);
    var distance = x_distance > y_distance ? x_distance : y_distance;
    
    // calculating the times
    var step_timeout = effect_duration / distance;
    var step_duration = step_timeout * effect_width;
    
    for (var i=0; i < map.length; i++) {
      for (var j=0; j < map[i].length; j++) {
        // calculating the effect timeout
        var x_diff = Math.abs(map[i][j].left - last_cell.left);
        var y_diff = Math.abs(map[i][j].top - last_cell.top);
        var diff = x_diff > y_diff ? x_diff : y_diff;
        var timeout = diff * step_timeout;
        
        // setting up the cells class-switch timeouts
        (function(cell, timeout) { // <- clear the scope
          cell._oldClassName = cell.element.className;
          cell._formerHTML = cell.element.innerHTML;
          
          window.setTimeout(function() {
            cell.element.innerHTML = ' ';
            cell.element.className = 'cell '+show_class;
          }, timeout);
          window.setTimeout(function() {
            cell.element.innerHTML = cell._formerHTML;
            cell.element.className = cell._oldClassName;
          }, timeout + step_duration);
          
        }).apply(this, [map[i][j], timeout]);
      }
    }
    
    this.finalSalutPlayed = true;
  }
});