/*
 * data object is of the form:
 * [
 *  alphabeteer: {
 *    "title_text": "Alphabeteer Challenge",
 *    "complete": false,
 *    "subparts": [
 *      'a',
 *      'b',
 *      'c'
 *    ],
 *    "subparts_completed": {
 *      "a": {
 *          "name":
 *          "position":
 *          ...
 *      },
 *    ]
 *    If there are any recommendations about what to do for these parts, then
 *    they can be added to this object
 *    "subparts_remaining_recommendations": {
 *      "c": {'Congleton'}
 *    }
 *  },
 * ]
 */

function generate_challenge_table() {

    // console.log('Generating Challenge Table')
    var table = $('<table></table>')
    // Set the ID so that we can easily find it again
    // table.attr("id", "challenge-table")
    // Use the 'results' id so that we pick up the standard styling
    table.attr("id", "results")
    // Optionally add a class with .addClass(this.tableClass)
    table.append($('<caption></caption>').text('Challenges'))

    // Add a set of links on the top row
    help_link = $('<a></a>').attr("href", browser.extension.getURL("/html/help.html")).attr("target", '_blank').text('help')
    options_link = $('<a></a>').attr("href", browser.extension.getURL("/html/options.html")).attr("target", '_blank').text('options')
    website_link = $('<a></a>').attr("href", "https://running-challenges.co.uk").attr("target", '_blank').text('website')
    help_td = $('<td></td>').attr('colspan', 6).attr('align', 'right')
    help_td.append(website_link)
    help_td.append(" | ")
    help_td.append(options_link)
    help_td.append(" | ")
    help_td.append(help_link)

    table.append($('<tr></tr>').append(help_td))

    return table

}

function add_table_break_row(table, title, help) {
    var tbody = $('<tbody/>')
    var gap_row = $('<tr/>')
    gap_row.append($('<th/>').attr('colspan', 6).append('<span>&nbsp;</span>'))
    tbody.append(gap_row)
    var main_row = $('<tr/>')
    var tooltip = ''
    if (help !== undefined) {
        tooltip = '<span style="font-size: 10px; vertical-align: middle; cursor: default" title="'+help+'">[?]</span>'
    }
    main_row.append($('<th/>').attr('colspan', 6).append('<span><b>'+title+'</b></span> '+tooltip))
    tbody.append(main_row)
    table.append(tbody)
}

function add_challenges_to_table(table, challenge_results_type, data) {
  // console.log(data)
   var ui_challenge_generation_duration = 0
   var challenge_visibility = ""

   data.challenge_results[challenge_results_type].forEach(function (challenge) {
       //console.log("Generating table rows for " + challenge.shortname)
	   
	   challenge_visibility = "Expanded"
	   if (has_visibility_choices(data)) {
			challenge_visibility = data.user_data.visibility_choices[challenge.shortname]
			//console.log(challenge.shortname+": "+challenge_visibility)
		}
		   
	   var start_time = new Date()
	   if (challenge.shortname == 'regionnaire') {
		   generate_regionnaire_table_entry(challenge, table, data)
	   } else {
		   generate_standard_table_entry(challenge, table, data)
	   }
	   var duration = new Date() - start_time
	   ui_challenge_generation_duration += duration
	   
	   	if (challenge_visibility == 'Collapsed') {
			$("tbody[id=challenge_tbody_content_"+challenge['shortname']+"]").toggle()
		}
		
	   if (challenge_visibility == 'Hidden') {
		   $("tbody[id=challenge_tbody_header_"+challenge['shortname']+"]").toggle()
		   $("tbody[id=challenge_tbody_content_"+challenge['shortname']+"]").toggle()
	   }
       // console.log("Completed generating table rows for " + challenge.shortname + " in " + duration + "ms")

   });

   // console.log("Completed generating challenge table rows in " + ui_challenge_generation_duration + "ms")

   return table
}

function get_tbody_header(challenge) {
    return $('<tbody></tbody>').attr('id', get_tbody_header_id(challenge))
}

function get_tbody_content(challenge) {
    return $('<tbody></tbody>').attr('id', get_tbody_content_id(challenge))
}

function get_tbody_header_id(challenge) {
    return "challenge_tbody_header_"+challenge['shortname']
}

function get_tbody_content_id(challenge) {
    return "challenge_tbody_content_"+challenge['shortname']
}

function get_flag_icon(country, height, width) {
    var flag_img = $('<img>'); //Equivalent: $(document.createElement('img'))
    flag_img.attr('src', browser.extension.getURL("/images/flags/png/"+country.flag_icon+".png"));
    // badge_img.attr('alt', challenge.name)
    // badge_img.attr('title', challenge.name)
    flag_img.attr('height', height)
    flag_img.attr('width', width)

    return flag_img
}


function get_challenge_icon(challenge, height, width) {
    var badge_img = $('<img>'); //Equivalent: $(document.createElement('img'))
    badge_img.attr('src', browser.extension.getURL("/images/badges/"+challenge.badge_icon+".png"));
    badge_img.attr('alt', challenge.name)
    badge_img.attr('title', challenge.name)
    badge_img.attr('height', height)
    badge_img.attr('width', width)

    return badge_img
}

function get_challenge_header_row(challenge, data) {

    var main_row = $('<tr></tr>')

    var badge_img = get_challenge_icon(challenge, 24, 24)
    badge_img.click(function(){
        $("tbody[id=challenge_tbody_content_"+challenge['shortname']+"]").toggle();
    });

    var anchor_tag = $('<a/>')
    anchor_tag.attr('name', challenge['shortname'])
    anchor_tag.append(badge_img)

    main_row.append($('<th></th>').append(anchor_tag))

    // main_row.append($('<th></th>').text(challenge.shortname))
    var help = ''
    if (challenge.help !== undefined) {
        help = '<span style="font-size: 10px; vertical-align: middle; cursor: default" title="'+challenge.help+'">[?]</span>'
    }
    var challenge_map_link_id = "challenge_"+challenge['shortname']+"_show_map"
    var challenge_map_id = "challenge_"+challenge['shortname']+"_map"
    var challenge_map_link = ''
    if (data.info.has_geo_data && challenge.has_map === true) {
        challenge_map_link = $('<span/>').attr("id", challenge_map_link_id).html("<span style=\"cursor: default\">show map</span>").click(function() {
        console.log(challenge_map_id)
        console.log(challenge)
        console.log(challenge.nearest_qualifying_events)
        create_challenge_map(challenge_map_id, challenge, data)
      })
    }

    main_row.append($('<th></th>').append(challenge.name + ' ' + help))
    main_row.append($('<th></th>').append(challenge_map_link))
    main_row.append($('<th></th>').text(challenge.completed_on))
    if (challenge.summary_text !== undefined) {
        main_row.append($('<th></th>').text(challenge.summary_text))
    } else {
        main_row.append($('<th></th>').text(challenge.subparts_completed_count+"/"+challenge.subparts_count))
    }
    if (challenge.complete) {
        main_row.append($('<img/>').attr('src', browser.extension.getURL("/images/badges/tick.png")).attr('width',24).attr('height',24))
    }

    return main_row
}

function generate_regionnaire_table_entry(challenge, table, data) {
    var shortname = challenge['shortname']

    var challenge_tbody_header = get_tbody_header(challenge)
    var challenge_tbody_detail = get_tbody_content(challenge)

    // Create the header row and add it to the tbody that exists to hold
    // the title row
    var main_row = get_challenge_header_row(challenge, data)
    challenge_tbody_header.append(main_row)

    // Create a row to hold a map
    var regionnaire_map_id = 'regionnaire_map'
    var map_row = $("<tr/>").append($('<td colspan="4"><div id="'+regionnaire_map_id+'" style="height:400px; width:400"></div></td>'))
    challenge_tbody_detail.append(map_row)
    var map_row = $("<tr/>").append($('<td colspan="4" align="center">Click the flags, pie-charts, and events in the map above for more info.<br/>Click on the countries and regions below to expand the data.</td>'))
    challenge_tbody_detail.append(map_row)

    draw_regionnaire_data_table(challenge_tbody_detail, challenge)

    table.append(challenge_tbody_header)
    table.append(challenge_tbody_detail)

    create_regionnaire_map(regionnaire_map_id, data, challenge)

}

function create_regionnaire_map(div_id, data, challenge) {
  // Create the map to start with

  // Find where to focus the map on to start with
  var default_centre = [25,0]
  if (data.info.has_home_parkrun && data.info.is_our_page) {
    var home_parkrun = data.user_data.home_parkrun_info
    if (event_has_valid_location(home_parkrun)) {
      default_centre = [+home_parkrun.lat, +home_parkrun.lon]
    }
  }

  var r_map = L.map(div_id).setView(default_centre, 2);
  // Allow it to be fullscreen
  r_map.addControl(new L.Control.Fullscreen());

  var map_data = {
      map: r_map,
      events_completed_map: challenge.events_completed_map,
      layers: {
        subregions: [],
        events: []
      }
  }

  // Mapping countries to flag image files
  var flag_map = {
      "New Zealand": "nz",
      "Australia": "au",
      "Denmark": "dk",
      "Finland": "fi",
      "France": "fr",
      "Germany": "de",
      // "Iceland"--
      "Ireland": "ie",
      "Italy": "it",
      "Japan": "jp",
      "Malaysia": "my",
      "Canada": "ca",
      "Norway": "no",
      "Poland": "pl",
      "Russia": "ru",
      "Singapore": "sg",
      "South Africa": "za",
      "Sweden": "se",
      "UK": "gb",
      "USA": "us"
      // "Zimbabwe"--
  }

  // Set the openstreetmap tiles
  var tilelayer_openstreetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })
  tilelayer_openstreetmap.addTo(r_map)

  // Icon sets
  var country_icon = L.ExtraMarkers.icon({
    markerColor: 'green-light',
    shape: 'circle'
  });

  var FlagIcon = L.Icon.extend({
      options: {
          shadowUrl: undefined,
          iconSize:     [40, 40],
          // Centre the icon by default
          iconAnchor:   [20, 20]
      }
  });

  var sub_region_icon = L.ExtraMarkers.icon({
    markerColor: 'cyan',
    shape: 'circle'
  });

  // Iterate through the top level countries
  // We are using our pre-scanned list here, so that we can take advantage of
  // having removed 'world', and perhaps adjusted any sub-countries (Namibia,
  // Swaziland spring to mind)

  map_data.layers.country_markers = new L.featureGroup();

  var flag_icon_anchor_centred = [20,20]
  var flag_icon_anchor_with_pie = [40,20]

  $.each(data.geo_data.data.countries, function (country_name, country_info) {

    var region_info = data.geo_data.data.regions[country_name]
    var events_complete_count = 0
    $.each(data.geo_data.data.regions[country_name].child_event_recursive_names, function(index, event_name) {
      if (event_name in map_data.events_completed_map) {
        events_complete_count += 1
      }
    })
    var events_total_count = data.geo_data.data.regions[country_name].child_event_recursive_names.length

    // console.log(region_info)
    // Only bother displaying this country if it has any events
    if (events_total_count > 0) {
      if (event_has_valid_location(region_info)) {

        // Get the location of the country mid-point, according to parkrun
        var lat_lon = [+region_info.lat, +region_info.lon]
        // Get the current regions id for later use by the on click callback function
        var region_id = region_info.id

        // If we haven't run any events, we omit the pie chart, so centre the
        // flag, else we shuffle it off to the left a bit so the combo is centred
        var flag_anchor = flag_icon_anchor_centred
        if (events_complete_count > 0) {
          flag_anchor = flag_icon_anchor_with_pie
        }

        // Top level countries have a flag
        var marker = L.marker(lat_lon, {
          icon: new FlagIcon({
            iconUrl: browser.extension.getURL("/images/flags/"+flag_map[country_name]+".png"),
            iconAnchor: flag_anchor
          })
        })
        // Add a tooltip showing the name of the country and a summary of the
        // completion numbers
        var marker_tooltip_text = country_name + ' ' + events_complete_count + '/' + events_total_count
        var marker_tooltip_options = {
          offset: [0, -16],
          direction: 'top'
        }
        marker.bindTooltip(marker_tooltip_text, marker_tooltip_options)
        marker.on('click', function() {
          show_sub_regions_and_events(map_data, data, region_id, 0)
        })
        marker.addTo(map_data.layers.country_markers);

        // Only add the pie chart if we have completed any events at all
        if (events_complete_count > 0) {
          var pie_marker = L.piechartMarker(lat_lon, {
            radius: 16,
            data: [
              {
                name: 'Run',
                value: events_complete_count,
                style: {
                  fillStyle: 'rgba(0,140,57,.95)',
                  strokeStyle: 'rgba(0,0,0,.75)',
                  lineWidth: 1
                }
              },
              {
                name: 'Not Run',
                value: (events_total_count - events_complete_count),
                style: {
                  fillStyle: 'rgba(0,0,0,.15)',
                  strokeStyle: 'rgba(0,0,0,.75)',
                  lineWidth: 1
                }
              }
            ],
            // Budge the pie chart over to the right a bit, so that the flag+chart are
            // mostly centred on the original point, and not wildly off to one side
            iconAnchor: [-4, 16]
          })
          // Add the same tooltips and on click actions as for the flag
          pie_marker.bindTooltip(marker_tooltip_text, marker_tooltip_options)
          pie_marker.on('click', function() {
            show_sub_regions_and_events(map_data, data, region_id, 0)
          })
          pie_marker.addTo(map_data.layers.country_markers);
        }

      }
    }

  })

  map_data.layers.country_markers.addTo(map_data.map)

}

function show_sub_regions_and_events(map_data, data, region_id, depth) {
  // console.log('Click for region: '+region_id+' depth='+depth)

  // Remove any existing subregions at or below our depth
  var regions_layer_key = 'subregions'
  if (regions_layer_key in map_data.layers) {
    while (map_data.layers[regions_layer_key].length > depth) {
      var layer = map_data.layers[regions_layer_key].pop()
      // console.log('Removed '+layer)
      map_data.map.removeLayer(layer)
    }
  }
  // ... and pop a fresh layer onto the stack
  map_data.layers[regions_layer_key].push(new L.featureGroup());

  // Remove any existing subregion events ...
  var events_layer_key = 'events'
  if (events_layer_key in map_data.layers) {
    while (map_data.layers[events_layer_key].length > depth) {
      var layers = map_data.layers[events_layer_key].pop()
      if ('done' in layers) {

        map_data.map.removeLayer(layers.done)
      }
      if ('notdone' in layers) {
        map_data.map.removeLayer(layers.notdone)
      }
      // console.log('Removed '+layers)
    }
  }
  // ... and pop a fresh layer onto the stack
  map_data.layers[events_layer_key].push({
    'done': new L.featureGroup(),
    'notdone': new L.featureGroup()
  });

  $.each(data.geo_data.data.regions, function (region_name, region_info) {
    if (region_info.parent_id == region_id) {

      // Compute how many events under this region there are, and how many we have run
      var events_complete_count = 0
      $.each(data.geo_data.data.regions[region_name].child_event_recursive_names, function(index, event_name) {
        if (event_name in map_data.events_completed_map) {
          events_complete_count += 1
        }
      })
      var events_total_count = data.geo_data.data.regions[region_name].child_event_recursive_names.length

      // Only display this sub-region if there are some events in it
      if (events_total_count > 0) {
        if (event_has_valid_location(region_info)) {
          // Get the location of the country mid-point, according to parkrun
          var lat_lon = [+region_info.lat, +region_info.lon]
          var sub_region_id = region_info.id
          var marker = L.piechartMarker(lat_lon, {
            radius: 16,
            data: [
              {
                name: 'Run',
                value: events_complete_count,
                style: {
                  fillStyle: 'rgba(0,140,57,.95)',
                  strokeStyle: 'rgba(0,0,0,.75)',
                  lineWidth: 1
                }
              },
              {
                name: 'Not Run',
                value: (events_total_count - events_complete_count),
                style: {
                  fillStyle: 'rgba(0,0,0,.15)',
                  strokeStyle: 'rgba(0,0,0,.75)',
                  lineWidth: 1
                }
              }
            ],
          })
          // var marker = L.marker(lat_lon, {icon: sub_region_icon})
          // Add a tooltip showing the name of the region, and put it above
          var marker_tooltip_text = region_name + ' ' + events_complete_count + '/' + events_total_count
          var marker_tooltip_options = {
            offset: [0, -16],
            direction: 'top'
          }
          marker.bindTooltip(marker_tooltip_text, marker_tooltip_options)
          marker.on('click', function() {
            show_sub_regions_and_events(map_data, data, sub_region_id, depth+1)
          })
          marker.addTo(map_data.layers[regions_layer_key][depth])
        }
      }
    }
  })
  map_data.layers[regions_layer_key][depth].addTo(map_data.map)

  // Icon for an event we have run
  var event_run_icon = L.ExtraMarkers.icon({
    markerColor: 'green-light',
    shape: 'circle'
  });

  // Icon for an event we have not run
  var event_not_run_icon = L.ExtraMarkers.icon({
    markerColor: 'cyan',
    shape: 'square'
  });

  $.each(data.geo_data.data.events, function (event_name, event_info) {
    if (event_info.region_id == region_id) {
      if (event_has_valid_location(event_info)) {
        // Get the location of the country mid-point, according to parkrun
        var lat_lon = [+event_info.lat, +event_info.lon]
        // Default marker shows we have not run it
        var marker = L.marker(lat_lon, {icon: event_not_run_icon})
        if (event_name in map_data.events_completed_map) {
          marker = L.marker(lat_lon, {icon: event_run_icon})
        }
        // Add a tooltip showing the name of the event
        var marker_tooltip_text = event_name
        var marker_tooltip_options = {
          offset: [0, -30],
          direction: 'top'
        }
        marker.bindTooltip(marker_tooltip_text, marker_tooltip_options)
        // Create a popup which includes a link to the event
        marker.bindPopup(get_parkrun_popup(event_name, event_info, {distance: false, completed_info: map_data.events_completed_map}))
        // Add it to the appropriate layer group
        if (event_name in map_data.events_completed_map) {
          marker.addTo(map_data.layers[events_layer_key][depth].done)
        } else {
          marker.addTo(map_data.layers[events_layer_key][depth].notdone)
        }
      }
    }
  })
  // Add the not-done icons first
  map_data.layers[events_layer_key][depth].notdone.addTo(map_data.map)
  map_data.layers[events_layer_key][depth].done.addTo(map_data.map)

}

var challenge_maps = {}

function create_challenge_map(map_id, challenge_data, data) {

  console.log(challenge_data)

  var home_parkrun_marker_colour = 'purple'

  // Create empty vector for each layer
  // var home_parkrun = new L.featureGroup()
  var events_complete = new L.featureGroup();
  // var events_complete_icon = new EventsIcon({iconUrl: browser.extension.getURL("/images/maps/markers/leaf-green.png")})
  var events_complete_icon = L.ExtraMarkers.icon({
    markerColor: 'green-light',
    shape: 'circle'
  });
  var events_complete_icon_home = L.ExtraMarkers.icon({
    markerColor: home_parkrun_marker_colour,
    shape: 'circle'
  });
  var events_nearest_incomplete = new L.featureGroup();
  // var events_nearest_incomplete_icon = new EventsIcon({iconUrl: browser.extension.getURL("/images/maps/markers/leaf-orange.png")})
  var events_nearest_incomplete_icon = L.ExtraMarkers.icon({
    markerColor: 'yellow',
    shape: 'penta'
  });
  var events_nearest_incomplete_icon_home = L.ExtraMarkers.icon({
    markerColor: home_parkrun_marker_colour,
    shape: 'penta'
  });
  var events_incomplete = new L.featureGroup();
  // var events_incomplete_icon = new EventsIcon({iconUrl: browser.extension.getURL("/images/maps/markers/leaf-red.png")})
  var events_incomplete_icon = L.ExtraMarkers.icon({
    markerColor: 'cyan',
    shape: 'square'
  });
  var events_incomplete_icon_home = L.ExtraMarkers.icon({
    markerColor: home_parkrun_marker_colour,
    shape: 'square'
  });

  var events_ineligible_icon_home = L.ExtraMarkers.icon({
    markerColor: home_parkrun_marker_colour,
    shape: 'star'
  });

  // // Add the home parkrun if it has been defined
  // if (challenge_data.home_parkrun) {
  //   var lat_lon = [+challenge_data.home_parkrun.lat, +challenge_data.home_parkrun.lon]
  //   var popup = 'Home parkrun: ' + challenge_data.home_parkrun.name
  //   var marker = L.marker(lat_lon).bindPopup(popup);
  //   marker.addTo(home_parkrun)
  // }

  // The ID of the element we are going to populate
  var map_element_id = "challenge_map_"+challenge_data.shortname
  // var map_element = document.getElementById(map_element_id)
  // Empty and hide all of the existing map elements
  $('div[id^="challenge_map_"]').each(function() {
    $(this).empty().hide()
  })
  // Make this map element visible
  var map_element = $('div[id="'+map_element_id+'"]').first()
  map_element.show()
  map_element.height(400)

  // See if there are any existing maps, and remove them all
  $.each(challenge_maps, function (id, map_data) {
    map_data.map.remove()
  })
  // Remove all references
  challenge_maps = {}

  // Default to centring on Winchester
  var map_centre_lat_lon = [51.0632, -1.308]
  if (data.info.is_our_page && data.info.has_home_parkrun) {
    var home_parkrun_info = data.user_data.home_parkrun_info
    if (event_has_valid_location(home_parkrun_info)) {
      map_centre_lat_lon = [+home_parkrun_info.lat, +home_parkrun_info.lon]
    }
  }
  var mymap = L.map(map_element_id).setView(map_centre_lat_lon, 10);

  // Add the new map to our set of maps for future reference
  challenge_maps[map_element_id] = {
    "map": mymap,
    "div_id": map_element_id
  }
  var tilelayer_openstreetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })
  tilelayer_openstreetmap.addTo(mymap)

  var events_on_the_map = []
  var added_home_parkrun = false

  // Add the completed events
  $.each(challenge_data.completed_qualifying_events, function(event_name, event_info) {
      if (!events_on_the_map.includes(event_name)) {
        if (event_has_valid_location(event_info)) {
          // Make sure they are numbers
          var lat_lon = [+event_info.lat, +event_info.lon]
          var popup = get_parkrun_popup(event_name, event_info, {distance: true})
          var marker = L.marker(lat_lon, {icon: events_complete_icon}).bindPopup(popup);
          if (data.info.is_our_page && data.info.has_home_parkrun && (data.user_data.home_parkrun_info.name == event_name)) {
              popup = get_parkrun_popup(event_name, event_info, {distance: false})
              marker = L.marker(lat_lon, {icon: events_complete_icon_home}).bindPopup(popup);
              added_home_parkrun = true
          }
          marker.addTo(events_complete)

          events_on_the_map.push(event_name)
        }
      }
  })
  // These markers should be on the top
  events_complete.setZIndex(50)
  // Add Those markers
  events_complete.addTo(mymap)

  if (events_complete.getLayers().length > 0) {
    mymap.fitBounds(events_complete.getBounds().pad(0.1));
  }

  if (data.info.is_our_page) {
    $.each(challenge_data.nearest_qualifying_events, function(event_name, event_info) {
        if (!events_on_the_map.includes(event_name)) {
          if (event_has_valid_location(event_info)) {
            // Make sure they are numbers
            var lat_lon = [+event_info.lat, +event_info.lon]
            var popup = get_parkrun_popup(event_name, event_info, {distance: true})
            var marker = L.marker(lat_lon, {icon: events_nearest_incomplete_icon}).bindPopup(popup);
            if (data.info.is_our_page && data.info.has_home_parkrun && (data.user_data.home_parkrun_info.name == event_name)) {
                popup = get_parkrun_popup(event_name, event_info, {distance: false})
                marker = L.marker(lat_lon, {icon: events_nearest_incomplete_icon_home}).bindPopup(popup);
                added_home_parkrun = true
            }
            marker.addTo(events_nearest_incomplete)

            events_on_the_map.push(event_name)
          }
        }
    })
    events_nearest_incomplete.setZIndex(25)
    // Add Those markers
    events_nearest_incomplete.addTo(mymap)
  }

  $.each(challenge_data.all_qualifying_events, function(event_name, event_info) {
    // console.log("all - " + event_name)
      if (!events_on_the_map.includes(event_name)) {
        if (event_has_valid_location(event_info)) {
          // Make sure they are numbers
          var lat_lon = [+event_info.lat, +event_info.lon]
          var popup = get_parkrun_popup(event_name, event_info, {distance: true})
          var marker = L.marker(lat_lon, {icon: events_incomplete_icon}).bindPopup(popup);
          if (data.info.is_our_page && data.info.has_home_parkrun && (data.user_data.home_parkrun_info.name == event_name)) {
              popup = get_parkrun_popup(event_name, event_info, {distance: false})
              marker = L.marker(lat_lon, {icon: events_incomplete_icon_home}).bindPopup(popup);
              added_home_parkrun = true
          }
          marker.addTo(events_incomplete)

          events_on_the_map.push(event_name)
        }
      }
  })
  events_incomplete.setZIndex(10)
  // Add Those markers
  // events_incomplete.addTo(mymap)

  // If we have not added the home parkrun, this means that it is not eligible
  // for this challenge, but it is still useful to add an icon for it - so lets
  // add it straight to the map now
  if (data.info.is_our_page && data.info.has_home_parkrun && (added_home_parkrun == false)) {
    if (event_has_valid_location(data.user_data.home_parkrun_info)) {
      var lat_lon = [+data.user_data.home_parkrun_info.lat, +data.user_data.home_parkrun_info.lon]
      var marker = L.marker(lat_lon, {icon: events_ineligible_icon_home});
      marker.addTo(mymap)
    }
  }

  base_maps = {
    "openstreetmap": tilelayer_openstreetmap
  }

  overlay_markers = {}

  // Add the overlays in the order we want them to appear

  overlay_markers["Completed Events"] = events_complete

  if (challenge_data.complete == false) {

    if (data.info.is_our_page && data.info.has_home_parkrun && events_nearest_incomplete.getLayers().length > 0) {
      overlay_markers['Nearest Qualifying Events'] = events_nearest_incomplete
    }

    // overlay_markers['Other Qualifying Events'] = events_incomplete
    // Only add it if there are any events in the list
    if (events_incomplete.getLayers().length > 0) {
      // I've override the css that creates the standard markers so they are all
      // red, although we really need to do it in a more configurable way
      var clustered_events_incomplete = L.markerClusterGroup({
        disableClusteringAtZoom: 9,
      });
      clustered_events_incomplete.addLayers(events_incomplete.getLayers())

      overlay_markers['Other Qualifying Events'] = clustered_events_incomplete
    }
  }

  layer_control_options = {
    'hideSingleBase': true
  }

  // Add a control which will provide a way to optionally turn on the layers
  // that we haven't added
  L.control.layers(base_maps, overlay_markers, layer_control_options).addTo(mymap);

  mymap.addControl(new L.Control.Fullscreen());

}

function event_has_valid_location(event_info) {
  var valid_location = false
  if (event_info.lat && event_info.lon) {
    if (event_info.lat != '' && event_info.lon != '') {
      valid_location = true
    }
  }
  return valid_location
}

function get_parkrun_popup(event_name, event_info, custom_options) {

  var options = {
    distance: true
  }
  if (custom_options.distance !== undefined) {
    options.distance = custom_options.distance
  }

  var event_name_link = event_name + ' parkrun'
  if (event_info.event_url) {
    event_name_link = '<div style="text-align:center"><a href="'+event_info.event_url+'" target="_blank">'+event_name+' parkrun</a></div>'
  } else if (event_info.local_url) {
    event_name_link = '<div style="text-align:center"><a href="'+event_info.local_url+'/'+event_info.shortname+'" target="_blank">'+event_name+' parkrun</a></div>'
  }
  popup = event_name_link
  if (event_info.distance !== undefined && options.distance) {
    popup = popup+'<br/><div style="text-align:center">'+event_info.distance.toFixed(1)+" km away</div>"
  }

  if (custom_options.completed_info && event_name in custom_options.completed_info) {
    popup = popup+'<br/><div style="text-align:center">First attended: '+custom_options.completed_info[event_name][0].date+"</div>"
  }
  return popup
}

function get_regionnaire_flag(country, visited) {

  var flag_icon = get_flag_image_src(country)

  var img = $('<img>');
  img.attr('src', flag_icon);
  img.attr('alt', country)
  img.attr('title', country)
  img.attr('width',16)
  img.attr('height',16)
  if (visited) {
    img.attr('style', 'padding-left:2px; padding-right:2px; opacity:1.0')
  } else {
    img.attr('style', 'padding-left:2px; padding-right:2px; opacity:0.25')
  }

  return img

}

function draw_regionnaire_data_table(table, challenge_data) {

  // First of all, add a row with the world stats on, which is the top level region
  world_region = challenge_data.unrolled_regions[1]

  var world_completion_percentage = world_region.recursive_child_events_completed / world_region.recursive_child_events_count
  var world_completion_fraction_string = world_region.recursive_child_events_completed +"/"+ world_region.recursive_child_events_count

  var row = $("<tr/>")
  row.append($("<td/>").append(get_regionnaire_flag("World", true)))
  row.append($("<td/>").append($("<b/>").text("World")))
  row.append($("<td/>"))
  row.append($("<td/>").text(world_completion_fraction_string))
  table.append(row)

  // Then iterate through the top level countries
  top_level_countries = []
  $.each(challenge_data.unrolled_regions, function(region_id, region) {
    if (region.parent_id == 1) {
      top_level_countries.push(region_id)
    }
  })

  // Sort the top level countries alphabetically, otherwise they come out in
  // id order, i.e. the order in which they had their first parkrun
  top_level_countries_sorted = top_level_countries.sort(function(a,b) {
    // Order the ids by the names of the regions they represent
    // I'm pretty sure we'll never need to compare an id with itself, so
    //  returning zero here for equality is mostly for completeness
    if (a == b) {
      return 0
    }
    if (challenge_data.unrolled_regions[a].name < challenge_data.unrolled_regions[b].name) {
      return -1
    } else {
      return 1
    }
  })

  top_level_countries.forEach(function(country_id) {
    country_region = challenge_data.unrolled_regions[country_id]
    // Skip those countries with no active parkruns
    if (country_region.recursive_child_events_count > 0) {
      // Calculate the proportion of parkruns completed.
      // There should be no divide by zero here are we are only adding the country
      //  if it has child regions
      var completion_percentage = country_region.recursive_child_events_completed / country_region.recursive_child_events_count
      var completion_fraction_string = country_region.recursive_child_events_completed +"/"+ country_region.recursive_child_events_count

      var row = $("<tr/>")
      var regionnaire_country_class = "regionnaire-country-"+country_id
      var regionnaire_parent_region_class_country = "regionnaire-parent-region-id-"+country_id

      var expand_country=function() {
        var parent_tr = $(this).closest("tr")
        if (parent_tr.hasClass("regionnaire-expanded")) {
          // We need to collapse this section - and everything inside it
          parent_tr.siblings('.'+regionnaire_country_class).each(function() {
            $(this).hide()
            // As we have collapsed everything, mark any sub elements as not expanded
            $(this).removeClass("regionnaire-expanded")
          })
          parent_tr.removeClass("regionnaire-expanded")
        } else {
          // We need to expand this section, but only the top level things
          // Only make visible those rows which have our country as the parent ID
          var sibling_query = "."+regionnaire_parent_region_class_country
          parent_tr.siblings(sibling_query).each(function() {
            $(this).show()
          })
          parent_tr.addClass("regionnaire-expanded")
        }
      }

      // We fade out the regionnaire flag if it hasn't been visited, with
      // get_regionnaire_flag's second argumemt being a true/false value of whether
      // you have been. By stating whether the completion percentage is above zero
      // we can calculate this on the fly
      row.append($("<td/>").append(get_regionnaire_flag(country_region.name, completion_percentage > 0)).append($("<a/>").attr("name", country_region.name)))
      row.append($("<td/>").append($("<b/>").text(country_region.name).click(expand_country).css('cursor', 'pointer')))
      row.append($("<td/>"))
      row.append($("<td/>").text(completion_fraction_string))
      table.append(row)

      // Iterate though each of the child regions (if they exist)
      country_region.child_regions.forEach(function(country_sub_region_id) {
        country_sub_region = challenge_data.unrolled_regions[country_sub_region_id]
        var regionnaire_parent_region_class_sub_region = "regionnaire-parent-region-id-"+country_sub_region_id

        var regionnaire_country_sub_region_class = "regionnaire-country-"+country_id+"-sub-region-"+country_sub_region_id

        if (country_sub_region.recursive_child_events_count > 0) {
          // Calculate the proportion of parkruns completed.
          // There should be no divide by zero here are we are only adding the region
          //  if the country has child regions
          var country_sub_region_completion_percentage = country_sub_region.recursive_child_events_completed / country_sub_region.recursive_child_events_count
          var country_sub_region_completion_fraction_string = country_sub_region.recursive_child_events_completed +"/"+ country_sub_region.recursive_child_events_count


          var expand_country_sub_region=function() {
            var parent_tr = $(this).closest("tr")
            if (parent_tr.hasClass("regionnaire-expanded")) {
              // We need to collapse this section - and everything inside it
              parent_tr.siblings('.'+regionnaire_parent_region_class_sub_region).each(function() {
                $(this).hide()
                // As we have collapsed everything, mark any sub elements as not expanded
                $(this).removeClass("regionnaire-expanded")
              })
              parent_tr.removeClass("regionnaire-expanded")
            } else {
              // We need to expand this section, but only the top level things
              // Only make visible those rows which have our country as the parent ID
              var sibling_query = "."+regionnaire_parent_region_class_sub_region
              parent_tr.siblings(sibling_query).each(function() {
                $(this).show()
              })
              parent_tr.addClass("regionnaire-expanded")
            }
          }

          var sub_region_row = $("<tr/>")
          sub_region_row.addClass(regionnaire_country_class)
          sub_region_row.addClass(regionnaire_parent_region_class_country)
          sub_region_row.append($("<td/>"))
          sub_region_row.append($("<td/>").append($("<b/>").append($("<i/>").text(country_sub_region.name))).click(expand_country_sub_region).css('cursor', 'pointer'))
          sub_region_row.append($("<td/>"))
          sub_region_row.append($("<td/>").text(country_sub_region_completion_fraction_string))
          // Start the sub-region row hidden
          sub_region_row.hide()
          table.append(sub_region_row)
        }

        // Add the events for each sub-region
        country_sub_region.child_events.forEach(function(event_name) {
          var completed_event = country_sub_region.child_events_completed[event_name]

          var event_row = $("<tr/>")
          event_row.addClass(regionnaire_country_class)
          event_row.addClass(regionnaire_parent_region_class_sub_region)
          event_row.append($("<td/>"))
          event_row.append($("<td/>").text(event_name))
          if (completed_event !== undefined) {
            event_row.append($("<td/>").text(completed_event.date))
          } else {
            event_row.append($("<td/>"))
          }
          event_row.append($("<td/>"))
          // Start the event row hidden
          event_row.hide()
          table.append(event_row)
        })

      })

      // Add the events for the top level countries with no sub-regions
      country_region.child_events.forEach(function(event_name) {
        var completed_event = country_region.child_events_completed[event_name]

        var event_row = $("<tr/>", {class: regionnaire_country_class })
        event_row.addClass(regionnaire_parent_region_class_country)
        event_row.append($("<td/>"))
        event_row.append($("<td/>").text(event_name))
        if (completed_event !== undefined) {
          event_row.append($("<td/>").text(completed_event.date))
        } else {
          event_row.append($("<td/>"))
        }
        event_row.append($("<td/>"))
        // Start the event row hidden
        event_row.hide()
        table.append(event_row)
      })

    }
  })

}

// function iterate_regionnaire_data(table, region, level, region_group) {
//
//     if (level === undefined) {
//         level = 0
//     }
//
//     initially_hidden = false
//     if (level > 1) {
//       initially_hidden = true
//     }
//
//     // Use the region ID in the class name, because the human readable names
//     // are full of spaces, non-latin characters, and all sorts.
//     var region_class_name = "regionnaire-class-"+region["id"]
//     var region_event_class_name = region_class_name+"-event"
//     var region_incomplete_event_class_name = region_class_name+"-event-incomplete"
//     var region_complete_event_class_name = region_class_name+"-event-complete"
//
//     var hide_show_message = "parkruns I haven't done"
//
//     if (region["child_events_total"] == 0) {
//         return
//     }
//
//     var row = $('<tr/>')
//     var twisty = $('<td/>').attr("id", region_class_name+"-twisty")
//     row.append(twisty)
//     if (level == 1) {
//       // if (region["child_regions"].length > 0) {
//       if (region["child_events_completed_count"] == 0) {
//         twisty.append(get_regionnaire_flag(region["name"], false))
//         // hide_region_sub_rows = true
//       } else {
//           twisty.append(get_regionnaire_flag(region["name"], true))
//           row.addClass("region_visible")
//       }
//       // }
//       // Set the geo region to the top level one (not world)
//       // e.g. UK, Australia, Denmark
//       region_group = region_class_name
//     }
//
//     var region_start_visible = region_group+"-level-"+level+"-visible"
//     var region_start_hidden = region_group+"-level-"+level+"-hidden"
//
//     console.log(region_start_visible + "/" + region_start_hidden)
//
//     // console.log("Hide subregions for "+region["name"]+"? - "+hide_region_sub_rows)
//
//     var clickable_country = $('<span/>')
//     country_text = region["name"]
//     // If the level is 0, 'World', then that is as special case and there are no
//     // subparts that need indenting.
//     // If the level is 1, i.e. a country, then there is nothing to join, and it is
//     // just like 'World'
//     // If the level is 2+, like 'UK > South East', then we need one '> ', which
//     // we get by doing our join below.
//     if (level > 1) {
//       var prefix = Array(level).join("> ")
//       country_text = prefix + region["name"]
//     }
//     clickable_country.append($('<b></b>').text(country_text))
//     if (region["child_regions"].length > 0) {
//       clickable_country.click(function(){
//
//       // Find the parent tr element
//       var parent_tr = $(this).closest("tr")
//       if (parent_tr.hasClass("region_visible")) {
//         // Collapse it
//         $("."+region_group+"-level-"+(level+1)+"-visible").hide();
//         $("."+region_group+"-level-"+(level+1)+"-hidden").hide();
//
//         // var twisty = $("#"+region_group+"-twisty")
//         // twisty.empty()
//         // twisty.append($('<b></b>').text("+"))
//         // Remove the class that says it is visible
//         parent_tr.removeClass("region_visible")
//       } else {
//         var class_name_to_make_visible = region_group+"-level-"+(level+1)+"-visible"
//         console.log("Making things visible with level="+(level+1)+" for "+class_name_to_make_visible)
//         // Then show the things the next level down that we intend to show
//         $("."+class_name_to_make_visible).show();
//
//         // var twisty = $("#"+region_group+"-twisty")
//         // twisty.empty()
//         // twisty.append($('<b></b>').text("-"))
//
//         parent_tr.addClass("region_visible")
//       }
//
//       })
//       clickable_country.click(function() {
//         clicky();
//       })
//       clickable_country.css('cursor', 'pointer')
//     }
//     row.append($('<td/>').append(clickable_country))
//
//     // We may remove this column if it is no longer useful
//     row.append($('<td></td>'))
//
//     var completion_string = region["child_events_completed_count"]+"/"+region["child_events_total"]
//     row.append($('<td></td>').text(completion_string))
//     row.addClass(region_event_class_name)
//     row.addClass(region_group)
//     row.addClass(region_start_visible)
//     if (initially_hidden) {
//       row.hide()
//     }
//     table.append(row)
//
//     // Print out those events that have been completed
//     region["child_events"].forEach(function (child_event) {
//         if (child_event in region["child_events_completed"]) {
//             var row = $('<tr></tr>')
//             row.addClass(region_complete_event_class_name)
//             row.append($('<td></td>').text(""))
//             row.append($('<td></td>'))
//             row.append($('<td></td>').text(child_event))
//             row.append($('<td></td>').text(region["child_events_completed"][child_event]["date"]))
//             row.addClass(region_group)
//             row.addClass(region_start_visible)
//             if (initially_hidden) {
//               row.hide()
//             }
//             table.append(row)
//         }
//     })
//     // Print the info of the ones that you are missing (if any)
//     if (region["complete"] == false) {
//         // Add a link to display the missing events (with them being normally
//         // hidden so as not to overwhelm the page)
//         // But only if there are sub-events
//         if (region.child_events.length > 0) {
//             var show_more_row = $('<tr/>')
//             show_more_row.append($('<td/>'))
//             show_more_row.append($('<td/>').append($('<span/>').click(function(){
//                     $("."+region_incomplete_event_class_name).show();
//                     // Change the visibility of the buttons for this section
//                     $("."+region_incomplete_event_class_name+"-show").hide();
//                     $("."+region_incomplete_event_class_name+"-hide").show();
//                 }).text('show '+hide_show_message+" ...")).attr('colspan', 3))
//             show_more_row.addClass(region_incomplete_event_class_name+"-show")
//             show_more_row.addClass(region_group)
//             show_more_row.addClass(region_start_visible)
//             if (initially_hidden) {
//               show_more_row.hide()
//             }
//             table.append(show_more_row)
//         }
//
//         // Create rows for all the unattended events, default to hidden
//         region["child_events"].forEach(function (child_event) {
//             if (!(child_event in region["child_events_completed"])) {
//                 var row = $('<tr></tr>')
//                 row.addClass(region_incomplete_event_class_name)
//                 row.append($('<td></td>'))
//                 row.append($('<td></td>'))
//                 row.append($('<td></td>').text(child_event))
//                 row.addClass(region_group)
//                 row.addClass(region_start_hidden)
//                 // Hide the row by default
//                 row.hide()
//                 table.append(row)
//             }
//         })
//
//         var hide_more_row = $('<tr/>')
//         hide_more_row.append($('<td/>'))
//         hide_more_row.append($('<td/>').append($('<span/>').click(function(){
//                 $("."+region_incomplete_event_class_name).hide();
//                 // Change the visibility of the buttons for this section
//                 $("."+region_incomplete_event_class_name+"-show").show();
//                 $("."+region_incomplete_event_class_name+"-hide").hide();
//             }).text('hide '+hide_show_message)).attr('colspan', 3))
//         hide_more_row.addClass(region_incomplete_event_class_name+"-hide")
//         hide_more_row.addClass(region_group)
//         hide_more_row.addClass(region_start_hidden)
//         // Hide by default
//         hide_more_row.hide()
//         table.append(hide_more_row)
//     }
//
//     region["child_regions"].forEach(function (child_region) {
//         iterate_regionnaire_data(table, child_region, level+1, region_group)
//     })
//
// }

function generate_standard_table_entry(challenge, table, data) {

    var challenge_tbody_header = get_tbody_header(challenge)
    var challenge_tbody_detail = get_tbody_content(challenge)

    // Create the header row and add it to the tbody that exists to hold
    // the title row
    var main_row = get_challenge_header_row(challenge, data)
    challenge_tbody_header.append(main_row)

    // Create a row to hold a map, and hide it
    if (challenge.has_map === true) {
      var map_row = $("<tr/>").append($('<td colspan="4"><div id="challenge_map_'+challenge.shortname+'" style="height:400; width:400"></div></td>'))
      challenge_tbody_detail.append(map_row)
    }

    // Print the subparts
    challenge.subparts_detail.forEach(function (subpart_detail) {
        var subpart_row = $('<tr></tr>')
        subpart_row.append($('<td></td>').text("-"))
        if (subpart_detail != null) {

            subpart_row.append($('<td></td>').text(subpart_detail.subpart))
            subpart_row.append($('<td></td>').text(subpart_detail.name))
            subpart_row.append($('<td></td>').text(subpart_detail.info))

            challenge_tbody_detail.append(subpart_row)
        } else {
             subpart_row.append($('<td></td>').text('Missing'))
             challenge_tbody_detail.append(subpart_row)
        }

    });

    table.append(challenge_tbody_header)
    table.append(challenge_tbody_detail)

}

function add_stats_table(div, data) {

  if (data.info.has_stats) {
    var table = $('<table/>')
    // Use the 'results' id so that we pick up the standard styling, yuk
    table.attr("id", "results")
    // Optionally add a class with .addClass(this.tableClass)
    table.append($('<caption/>').text('Additional Athlete Stats'))
    // Add header row
    var header_row = $('<tr/>').html('<th>Stat</th><th>Value</th>')
    table.append(header_row)

    $.each(data.stats, function(stat_shortname, stat_info) {
      var row = $('<tr/>')
      var display_name = stat_info.display_name
      var stat_value = stat_info.value
      if (stat_info.help) {
        display_name = '<span style="cursor: default" title="'+stat_info.help+'">'+display_name+'</span>'
        stat_value = '<span style="cursor: default" title="'+stat_info.help+'">'+stat_value+'</span>'
      }
      row.append($('<td/>').html(display_name))
      if (stat_info.url !== undefined) {
        row.append($('<td/>').append($('<a/>', {href: stat_info.url, text: stat_info.value, target: "_blank", title: stat_info.help })))
      } else {
        row.append($('<td/>').html(stat_value))
      }
      table.append(row)
    })

    div.append(table)
  }

  // Append a message noting that some information may be missing
  // if there is no athlete_id or home parkrun set
  if (data.info.has_athlete_id == false || data.info.has_home_parkrun == false) {
    var options_message_container = $('<div/>')
    options_link = $('<a/>').attr("href", browser.extension.getURL("/html/options.html")).attr("target", '_blank').text('options.')
    options_message_container.append('N.B. More stats and map features are available if you set your home parkrun and athlete id in the ')
    options_message_container.append(options_link)
    div.append($('<br/>'))
    div.append(options_message_container)
  }
  div.append('<br/>Hover over the stats for a more detailed description')

}
