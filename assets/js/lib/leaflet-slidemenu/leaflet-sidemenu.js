L.Control.SideMenu = L.Control.extend({
    options: {
        callback: undefined,
        special_event_data: undefined
    },

    sendGoogleAnalyticsEvent: function(event) {
      this_data = this()
      // console.log("Event destined for Google Analytics received: "+JSON.stringify(this_data))
      if (window.gtag !== undefined && window.gtag !== null) {
        // console.log("gtag: "+window.gtag)
        gtag_action = "map"
        if ("action" in event) {
          gtag_action = event.action
        }
        // The event passed in should be of the form:
        // {
        //   'event_category': <category>,
        //   'event_label': <label>,
        //   'value': <value>
        // }
        gtag_event = {}
        // Add the available fields from the passed in event to the object we
        // are going to send to Google Analytics
        gtag_event_fields = ["event_category", "event_label", "value"]
        gtag_event_fields.forEach(function(field) {
          if (field in this_data) {
            gtag_event[field] = this_data[field]
          }
        })
        // console.log("Sending GA event: "+gtag_action+": "+JSON.stringify(gtag_event))
        window.gtag('event', gtag_action, gtag_event);
      } else {
        // console.log("No analtics object available")
      }
    },

    initialize: function(options){
        L.Util.setOptions(this, options)
    },

    selectEventTypeChanged: function() {
      this.redrawMenuContents()
    },

    redrawMenuContents: function(selected_event_type_name) {

      var this_leaflet_menu = this

      console.log("Redrawing menu contents")
      console.log("Selected event type name is: "+selected_event_type_name)

      data = this.options.special_event_data

      // Bail if there is no data at all, or no listed events
      if (data === undefined || Object.keys(data).length == 0) {
        if (this.options.callback !== undefined) {
          this.options.callback()
        }
        return
      }

      // Default to the first one in the list if no event name has been provided
      // In the future we should default to the the first one that hasn't happened yet :)
      if (selected_event_type_name === undefined || (!(selected_event_type_name in data))) {
        console.log("Checking if there is something already selected in the dropdown")
        var e = document.getElementById("slidemenu_special_event_type_name");
        if (e !== null && e !== undefined) {
          selected_event_type_name = e.options[e.selectedIndex].value;
          console.log("Found existing selected option: "+selected_event_type_name)
        } else {
          if ("New Year's Day" in data) {
            selected_event_type_name = "New Year's Day"
          } else {
            selected_event_type_name = Object.keys(data)[0]
          }
          console.log("No selected event provided, defaulting to the first one - " + selected_event_type_name)
        }
      }

      // If there is some contents already, remove it
      if (this._contents !== undefined) {
        console.log("Removing existing menu contents")
        L.DomUtil.remove(this._contents)
      }
      // Create new contents from scratch
      this._contents = L.DomUtil.create('div', 'leaflet-sidemenu-contents', this._menu);


      var date_select = L.DomUtil.create('fieldset', '', this._contents)
      var date_select_legend = L.DomUtil.create('legend', '', date_select)
      date_select_legend.innerText = "Special Dates:"

      // List the special events
      var event_select = L.DomUtil.create('select', '', date_select)
      event_select.setAttribute("id", "slidemenu_special_event_type_name")
      L.DomEvent.on(event_select, 'change', this.selectEventTypeChanged, this)
      // Send a Google Analytics event
      L.DomEvent.on(event_select, "change", this_leaflet_menu.sendGoogleAnalyticsEvent, function() {
        return {
          "event": "map config change",
          "event_category": "select event type",
          "event_label": event_select.value
        }
      })
      // Sort the items in the menu by the date that they happen
      var event_names_sorted_by_date = Object.keys(data).sort(function(a,b) {
        console.log("Comparing "+a+" "+data[a].date+" "+b+" "+data[b].date)

        if (data[a].date > data[b].date) {
          return 1
        } else {
          return -1
        }
      })
      // Add the options to the menu
      event_names_sorted_by_date.forEach(function(special_event_type_name){
        // console.log(special_event_type_name)
        var this_option = L.DomUtil.create('option', '', event_select)
        this_option.innerText = special_event_type_name
        this_option.value = special_event_type_name
        if (special_event_type_name == selected_event_type_name) {
          this_option.setAttribute("selected", true)
        }
      })
      L.DomUtil.create('br', '', date_select)
      var date_select_date = L.DomUtil.create('span', '', date_select)
      date_select_date.innerText = data[selected_event_type_name].date


      // Draw the available times
      var events_by_time = {}

      Object.keys(data[selected_event_type_name]['events']).forEach(function(special_event_name) {
        special_event_info = data[selected_event_type_name]['events'][special_event_name]
        if (!(special_event_info["time"] in events_by_time)) {
          events_by_time[special_event_info["time"]] = []
        }
        events_by_time[special_event_info["time"]].push(special_event_info)
      })
      console.log(events_by_time)

      if (Object.keys(events_by_time).length == 0) {
        console.log("No events available")
        if (this.options.callback !== undefined) {
          this.options.callback()
        }
        return
      }

      // Order the times, and display them
      var time_select = L.DomUtil.create('fieldset', '', this._contents)

      var legend = L.DomUtil.create('legend', '', time_select)
      legend.innerText = "Available Times:"

      var option_counter = 0
      Object.keys(events_by_time).sort().forEach(function(special_event_time) {

        var this_option_id = "time_select_input_"+option_counter

        var this_option = L.DomUtil.create('input', '', time_select)
        this_option.setAttribute("type", "checkbox")
        this_option.setAttribute("checked", true)
        this_option.setAttribute("value", special_event_time)
        this_option.setAttribute("id", this_option_id)
        if (this_leaflet_menu.options.callback !== undefined) {
          L.DomEvent.on(this_option, "change", this_leaflet_menu.options.callback, this)
        }
        L.DomEvent.on(this_option, "change", this_leaflet_menu.sendGoogleAnalyticsEvent, function() {
          return {
            "event": "map config change",
            "event_category": this_option.checked ? "select event time" : "deselect event time",
            "event_label": this_option.value
          }
        })

        // Add a label for this option
        var this_option_label = L.DomUtil.create('label', '', time_select)
        this_option_label.setAttribute("for",  this_option_id)
        this_option_label.innerText = special_event_time
        L.DomUtil.create('br', '', time_select)
        option_counter += 1
      })


      // Give a choice between selecting the 5k or 2k events
      var distance_select = L.DomUtil.create('fieldset', '', this._contents)

      var distance_legend = L.DomUtil.create('legend', '', distance_select)
      distance_legend.innerText = "Events:"

      var option_counter = 0
      var distance_events = ["parkrun", "junior parkrun"]
      distance_events.forEach(function(special_event_distance) {

        var this_option_id = "distance_select_input_"+option_counter

        var this_option = L.DomUtil.create('input', '', distance_select)
        this_option.setAttribute("type", "checkbox")
        this_option.setAttribute("checked", true)
        this_option.setAttribute("value", special_event_distance)
        this_option.setAttribute("id", this_option_id)
        if (this_leaflet_menu.options.callback !== undefined) {
          L.DomEvent.on(this_option, "change", this_leaflet_menu.options.callback, this)
        }
        L.DomEvent.on(distance_select, "change", this_leaflet_menu.sendGoogleAnalyticsEvent, function() {
          return {
            "event": "map config change",
            "event_category": this_option.checked ? "select event category" : "deselect event category",
            "event_label": this_option.value
          }
        })

        // Add a label for this option
        var this_option_label = L.DomUtil.create('label', '', distance_select)
        this_option_label.setAttribute("for",  this_option_id)
        this_option_label.innerText = special_event_distance
        L.DomUtil.create('br', '', distance_select)
        option_counter += 1
      })

      if (this.options.callback !== undefined) {
        this.options.callback()
      }

    },

    onAdd: function (map) {
      console.log(this.options)
        var container = L.DomUtil.create('div', 'leaflet-control-sidemenu leaflet-bar leaflet-control');

        this.link = L.DomUtil.create('a', 'leaflet-control-sidemenu-button leaflet-bar-part', container);
        this.link.href = '#'
        this.link.title = "Menu"

        // Link the event handler to fire when the menu item is clicked
        L.DomEvent.on(this.link, 'click', this._click, this);
        L.DomEvent.on(this.link, "click", this.sendGoogleAnalyticsEvent, function() {
          return {
            "event": "map interaction",
            "event_category": "side menu",
            "event_label": "open"
          }
        })

        this._map = map;

        this._menu = L.DomUtil.create('div', 'leaflet-sidemenu', map._container)
        // Stop the user doing anything when over the menu
        L.DomEvent.disableClickPropagation(this._menu);
        L.DomEvent.on(this._menu, 'mouseover', function(){
            map.scrollWheelZoom.disable();
        });
        L.DomEvent.on(this._menu, 'mouseout', function(){
            map.scrollWheelZoom.enable();
        });

        this._menu.style.width = "200px"
        this._menu.style.right = "0px"
        this._menu.style.height = "100%"

        this._setVisibility(true)

        this.closeLink = L.DomUtil.create('a', '', this._menu);
        this.closeLink.href = '#'
        this.closeLink.innerText = "Close Menu"
        this.closeLink.title = "Close Menu"
        L.DomEvent.on(this.closeLink, 'click', this._closeLinkClick, this);
        L.DomEvent.on(this.closeLink, "click", this.sendGoogleAnalyticsEvent, function() {
          return {
            "event": "map interaction",
            "event_category": "side menu",
            "event_label": "close"
          }
        })
        this.redrawMenuContents()

        return container;
    },

    _toggleSideMenu: function() {
      console.log("Toggling side menu")
      this._setVisibility(!this._sideMenuVisible)
    },

    _setVisibility: function(visible) {
      this._sideMenuVisible = visible
      this._menu.style.visibility = this._sideMenuVisible ? "visible" : "hidden"
    },

    _closeLinkClick: function(e) {
      L.DomEvent.stopPropagation(e);
      L.DomEvent.preventDefault(e);
      console.log("_closeLinkClick")
      this._setVisibility(false)
    },

    _click: function (e) {
        L.DomEvent.stopPropagation(e);
        L.DomEvent.preventDefault(e);
        console.log("_click")
        this._toggleSideMenu()
    },

});

L.Map.include({
    issidemenu: function () {
        return this._issidemenu || false;
    },

    togglesidemenu: function (options) {
      console.log("togglesidemenu")
    }
});
