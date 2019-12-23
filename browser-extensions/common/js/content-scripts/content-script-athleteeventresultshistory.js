
function get_table(id, caption) {

    query_string = "table"
    if (id !== undefined) {
        query_string += "[id="+id+"]"
    }


    return $(query_string).filter(function(index) {

        // If no caption is specified, return every result
        if (caption === undefined) {
            return true
        }

        // Else, get the captions for these tables
        table_captions = $("caption", this)
        // Skip anything without exactly one caption
        if (table_captions.length !== 1) {
            return false
        }
        // Only include this table if the caption is correct
        return table_captions[0].innerText == caption
    })
}

function add_challenge_badges(div, data) {

  console.log('Adding '+JSON.stringify(data)+' to '+ div)

    badge_p = $("p", div)
    badge_p.empty()

    var index_counter = 1
    data.forEach(function (challenge) {
        var challenge_link = $('<a></a>')
        challenge_link.attr('href', challenge.link)

        var img = $('<img>'); //Equivalent: $(document.createElement('img'))
        img.attr('src', challenge.icon);
        img.attr('alt',challenge.name)
        img.attr('title',challenge.name)
        img.attr('width',64)
        img.attr('height',64)

        challenge_link.append(img)

        badge_p.append(challenge_link)

        if (index_counter > 0 && index_counter % 8 == 0) {
            badge_p.append($('<br/>'))
        }
        index_counter += 1
    })

}

function get_badge_location() {
    return $("div[id=content]").find("p:first")
}

function parse_volunteer_table(result) {

  // Find all the results tables in this page
  var completed_volunteer_roles = {}
  $("table[id=results]",result).each(function (results_table_index) {
     // Try and find the table that also has a <h1> containing
     // "Volunteer Summary"
     var results_table = $(this)
     parent = $(this).parent()
     $("h1:contains('Volunteer Summary')", parent).each(function (index) {
         completed_volunteer_roles = {}
         $("tbody>tr", results_table).each(function (role_index) {
             table_cells = $("td", this)
             volunteer_role = table_cells[1].innerText
             volunteer_role_quantity = table_cells[2].innerText

             // Try and translate from whatever language it is in
             normalised_volunteer_role = get_normalised_volunteer_role(volunteer_role)

             if (!(normalised_volunteer_role in completed_volunteer_roles)) {
                 completed_volunteer_roles[normalised_volunteer_role] = 0
             }
             completed_volunteer_roles[normalised_volunteer_role] += parseInt(volunteer_role_quantity)
         })
         // console.log(completed_volunteer_roles)
     })

  })
  return completed_volunteer_roles
}

function set_complete_progress_message(errors) {
  var messages = ['Additional badges provided by <a href="https://running-challenges.co.uk" target="_blank">Running Challenges</a>']
  $.each(errors, function(index, error_message) {
    messages.push(error_message)
  })
  if (errors.length > 0) {
    messages.push('Refresh the page to try again')
  }
  set_progress_message(messages.join('<br/><br/>'))
}

function set_progress_message(progress_message) {
  console.log("Progress: "+progress_message)
  $("div[id=running_challenges_messages_div]").html(progress_message)
}

function parse_results_table() {

  parkruns_completed = []

  get_table("results", get_localised_value('table_all_results')).each(function(results_table) {
      // Gather the data for this table

      // Find all the table body rows
      completed_parkrun_events = $("tbody>tr", this)

      completed_parkrun_events.each(function(index) {
          // Only parse table rows with at least one cell, and look at the first one
          table_cells = $("td", this)
          if (table_cells.length > 0) {
              // Find the name and other interesting bits of data for this parkrun
              parkrun_name = table_cells[0].innerText.trim()
              parkrun_date = table_cells[1].innerText.trim()
              parkrun_event_number = table_cells[2].innerText.trim()
              parkrun_position = table_cells[3].innerText.trim()
              parkrun_time = table_cells[4].innerText.trim()
              parkrun_pb = table_cells[6].innerText.trim()

              // Create a date object, useful for comparing
              parkrun_date_obj = new Date()
              date_parts = parkrun_date.split("/")
              if (date_parts.length == 3) {
                  parkrun_date_obj = new Date(date_parts[2]+"-"+date_parts[1]+"-"+date_parts[0])
              }

              // Store this parkrun instance in our big data structure
              parkrun_stats = {
                  "name": parkrun_name,
                  "date": parkrun_date,
                  "date_obj": parkrun_date_obj,
                  "event_number": parkrun_event_number,
                  "position": parkrun_position,
                  "time": parkrun_time,
                  "pb": parkrun_pb.length > 0
              }
              parkruns_completed.push(parkrun_stats)

          }
      });
  });

  // Return the results in reverse chronological order, which is the natural
  // way to process it, as the older parkruns will be hit first when iterating
  // over the list
  return parkruns_completed.reverse()
}


function create_skeleton_elements(id_map) {

  top_of_the_page_anchor = $("div[id=content]").find("p:first")

  // The top sections are badges, flags, and messages.
  // Initially the badges and flags are empty until the data is parsed and loaded,
  // and the messsages displayed will indicate progress.

  // Spacer to separate the existing shirt icons from our badges
  var running_challenges_top_spacer = $('<br/>')
  top_of_the_page_anchor.after(running_challenges_top_spacer)

  // Create badges element
  var running_challenges_badges_div_container = $('<p/>')
  var running_challenges_badges_div = $('<div/>').attr("id", id_map["badges"])
  running_challenges_badges_div_container.append(running_challenges_badges_div)
  running_challenges_top_spacer.after(running_challenges_badges_div_container)

  // Create flags element
  var running_challenges_flags_div = $('<div/>').attr("id", id_map["flags"])
  running_challenges_badges_div_container.after(running_challenges_flags_div)

  var running_challenges_message_spacer = $('<br/>')
  running_challenges_flags_div.after(running_challenges_message_spacer)

  // Add a message div, with some initial contents
  var running_challenges_messages_div = $('<div/>').attr("id", id_map["messages"])
  running_challenges_message_spacer.after(running_challenges_messages_div)
  // Use the progress message function to se interval
  set_progress_message('Loading <a href="https://running-challenges.co.uk" target="_blank">Running Challenges</a> Badges')

  // Create main table element
  var running_challenges_main_table_div = $('<div/>').attr("id", id_map["main"])
  get_table('results', get_localised_value('table_all_results')).before(running_challenges_main_table_div)

  // Create stats element
  var running_challenges_stats_div = $('<div/>').attr("id", id_map["stats"])
  running_challenges_main_table_div.before(running_challenges_stats_div)

  // Add a spacer between the stats and the main table
  running_challenges_main_table_div.before($('<br/>'))

  // Add a spacer after the main table
  running_challenges_main_table_div.after($('<br/>'))
}

function add_stats(div_id, data) {
  set_progress_message("Adding stats")
  var stats_div = $("div[id="+div_id+"]")
  add_stats_table(stats_div, data)
  set_progress_message("Added stats")
}

function add_badges(div_id, data) {
  set_progress_message("Adding badges")
  // Find out which challenges we have been provided, and determine if they are
  // complete, and if so, award the badge
  var badges = []
  if (data.challenge_results) {
    // Running badges
    if (data.challenge_results.running_results) {
      data.challenge_results.running_results.forEach(function(result) {
        var badge = get_running_badge(result)
        if (badge) {
          badges.push(badge)
        }
      })
    }
    // Volunteer badges
    if (data.challenge_results.volunteer_results) {
      data.challenge_results.volunteer_results.forEach(function(result) {
        var badge = get_volunteer_badge(result)
        if (badge) {
          badges.push(badge)
        }
      })
    }
  }

  // Now insert all the badges into the page
  badge_div = $("div[id="+div_id+"]")

  var index_counter = 1
  badges.forEach(function (badge) {
      var badge_link = $('<a></a>')
      badge_link.attr('href', badge.link)

      var img = $('<img>')
      img.attr('src', badge.icon)
      img.attr('alt',badge.name)
      img.attr('title',badge.name)
      img.attr('width',64)
      img.attr('height',64)

      badge_link.append(img)
      badge_div.append(badge_link)

      if (index_counter > 0 && index_counter % 8 == 0) {
          badge_div.append($('<br/>'))
      }
      index_counter += 1
  })

  // All done!
  set_progress_message("Added badges")
}

// Format the badge information specific to the running challenge data
function get_running_badge(result) {
  var badge_info = undefined
  // console.log(result)
  if (result.complete == true) {
    badge_info = {
        "name": result.name,
        "icon": browser.extension.getURL("/images/badges/"+result.badge_icon+".png"),
        "link": "#"+result.shortname
    }
  } else if (result.partial_completion == true) {
      badge_info = {
        "name": result.partial_completion_name,
        "icon": browser.extension.getURL("/images/badges/"+result.partial_completion_badge_icon+".png"),
        "link": "#"+result.shortname
      }
  }
  return badge_info
}

// Format the badge information specific to the volunteer challenge data -
// in particular, we award the stars based on how many times each has been done
function get_volunteer_badge(result) {
  var badge_info = undefined
  // console.log(result)
  if (result.complete == true) {
      badge_info = {
          "name": result.name,
          "icon": browser.extension.getURL("/images/badges/"+result.badge_icon+".png"),
          "link": "#"+result.shortname
      }
      if (result.subparts_completed_count >= 25){
          badge_info.icon = browser.extension.getURL("/images/badges/"+result.badge_icon+"-3-stars.png")
          badge_info.name += " (25+ times)"
      } else if (result.subparts_completed_count >= 10){
          badge_info.icon = browser.extension.getURL("/images/badges/"+result.badge_icon+"-2-stars.png")
          badge_info.name += " (10+ times)"
      } else if (result.subparts_completed_count >= 5){
          badge_info.icon = browser.extension.getURL("/images/badges/"+result.badge_icon+"-1-star.png")
          badge_info.name += " (5+ times)"
      }
  }
  return badge_info
}

function add_flags(div_id, data) {
  set_progress_message("Adding flags")
  // console.log(data)

  if (data.parkrun_results && data.geo_data) {

    countryCompletionInfo = calculateCountryCompletionInfo(data)
    console.log(countryCompletionInfo)

    // Generate a list of visited countries
    countriesVisited = []
    $.each(countryCompletionInfo, function(countryName, countryInfo){
      if (countryInfo.visited) {
        countriesVisited.push(countryInfo)
      }
    })
    console.log(countriesVisited)


    // global_tourism_info = generate_global_tourism_data(data.parkrun_results, data.geo_data)
    // console.log(global_tourism_info)

    flags_div = $("div[id="+div_id+"]")

    var index_counter = 1
    countriesVisited.sort(function (o1,o2) {
        // Equal
        if (o1.firstRanOn === o2.firstRanOn) {
            return 0
        }
        // If either are null they should go to the back, although this shouldn't be the case
        // as we have already pruned out those we haven't visited
        if (o1.firstRanOn === null) {
            return 1
        }
        if (o2.firstRanOn === null) {
            return -1
        }
        return o1.firstRanOn - o2.firstRanOn
    }).forEach(function (country) {
        if (country.visited) {
            // Find out when it was first run and make a nice string
            var first_run = country.firstRanOn.toISOString().split("T")[0]

            var regionnaire_link = $("<a/>").attr("href", "#"+country.name)

            var img = $('<img>');
            img.attr('src', get_flag_image_src(country.name))
            img.attr('alt',country.name)
            img.attr('title',country.name+": "+first_run)
            img.attr('width',48)
            img.attr('height',48)
            img.attr('style', 'padding-left:6px; padding-right:6px')

            regionnaire_link.append(img)
            flags_div.append(regionnaire_link)

            if (index_counter > 0 && index_counter % 8 == 0) {
                flags_div.append($('<br/>'))
            }
            index_counter += 1
        }
    })
  }

  set_progress_message("Added flags")
}

function add_challenge_results(div_id, data) {
  set_progress_message("Adding challenge results")
  // console.log(data)
  results_div = $("div[id="+div_id+"]")
  results_table = generate_challenge_table()
  results_div.append(results_table)
  // Add the results if we have them
  if (data.info.has_challenge_results) {
    if (data.info.has_challenge_running_results) {
      add_challenges_to_table(results_table, 'running_results', data)
    }
    // Add the regionnaire table on it's own, after the challenges, always
    generateRegionnaireTableEntry(results_table, data)
    if (data.info.has_challenge_volunteer_results) {
      add_table_break_row(results_table, "Volunteer Challenges", "Get a purple badge when you've done a role once, get a star for doing the role 5+ times, two stars for 10+ times, three stars for 25+ times.")
      add_challenges_to_table(results_table, 'volunteer_results', data)
    }
  }
  set_progress_message("Added challenge results")
}

// What all our container divs are called
var id_map = {
  "messages": "running_challenges_messages_div",
  "badges": "running_challenges_badges_div",
  "flags": "running_challenges_flags_div",
  "main": "running_challenges_main_div",
  "stats": "running_challenges_stats_div"
}

create_skeleton_elements(id_map)

var loaded_user_data = {}
var loaded_geo_data = undefined
var parsed_volunteer_data = undefined
var parsed_results_data = undefined

set_progress_message("Parsing Results")
parsed_results_data = parse_results_table()
set_progress_message("Parsed Results")

set_progress_message("Loading saved data")
browser.storage.local.get(["home_parkrun_info", "athlete_number", "challengeMetadata"]).then((items) => {
  set_progress_message("Loaded saved data")
  loaded_user_data = items
  // console.log("Here is the stored items, fetched with a promise:")
  // console.log(items)

  // Now lets fetch the geo data
  set_progress_message("Loading geo data")
  return browser.runtime.sendMessage({data: "geo"});
}).then((results) => {
  set_progress_message("Loaded geo data")
  console.log('Loaded geo data was:')
  console.log(results.geo)
  // The return packet will normally be valid even if the geo data is not contained
  // within, so we do some sanity check here
  if (results.geo && results.geo.data) {
    loaded_geo_data = results.geo
  } else {
    console.log('Geo data rejected')
  }

  set_progress_message("Loading volunteer data")
  // Now lets fetch the volunteer information
  return $.ajax({
    // If we translate this URL into the local one, not only do we have to
    // parse the page separately (no big deal), but we need to add every
    // domain into our CSP, which is a bit annoying, but would maybe
    // turn out to be more efficient for the user in a country far away
    // from the UK (depending on where parkrun host these servers)
    url: "https://www.parkrun.org.uk/results/athleteresultshistory/?athleteNumber="+get_athlete_id(),
    dataType: 'html'})
}).then((results) => {
  set_progress_message("Loaded volunteer data")
  // console.log("Here is the volunteer data, fetched with a promise:")
  // console.log(results)
  set_progress_message("Parsing volunteer data")
  parsed_volunteer_data = parse_volunteer_table(results)
  set_progress_message("All done")

  data = {
    'parkrun_results': parsed_results_data,
    'volunteer_data': parsed_volunteer_data,
    'geo_data': loaded_geo_data,
    'user_data': loaded_user_data,
    'info': {}
  }

  // Now add some supplemental information
  // Is the page we are looking at the one for the user who has configured the plugin?
  // - this will help us hide the 'home parkrun' and data based on that from
  //   user profiles it does not belong to

  data.info.has_athlete_id = (loaded_user_data.athlete_number !== undefined && loaded_user_data.athlete_number != '')
  data.info.has_home_parkrun = (loaded_user_data.home_parkrun_info !== undefined && loaded_user_data.home_parkrun_info.name !== undefined)
  data.info.is_our_page = (data.info.has_athlete_id && get_athlete_id() == loaded_user_data.athlete_number)
  // Convenience properties for the main sources of data
  data.info.has_geo_data = (data.geo_data !== undefined)
  data.info.has_geo_technical_event_data = (data.geo_data !== undefined && (data.geo_data.data.event_status !== undefined))
  data.info.has_parkrun_results = (data.parkrun_results !== undefined)

  data.challenge_results = {
    "running_results": generate_running_challenge_data(data),
    "volunteer_results": generate_volunteer_challenge_data(data)
  }
  // Update info with booleans for the presence of results
  data.info.has_challenge_results = (data.challenge_results !== undefined)
  data.info.has_challenge_running_results = (data.info.has_challenge_results && data.challenge_results.running_results !== undefined)
  data.info.has_challenge_volunteer_results = (data.info.has_challenge_results && data.challenge_results.volunteer_results !== undefined)
  data.info.has_volunteer_data = (data.volunteer_data !== undefined)

  data.stats = generate_stats(data)
  // Update info with boolean for the presence of stats
  data.info.has_stats = (data.stats !== undefined)

  console.log(data)

  // Use the acquired data to add all the additional information to the page
  add_badges(id_map["badges"], data)
  add_flags(id_map["flags"], data)
  add_challenge_results(id_map["main"], data)
  add_stats(id_map["stats"], data)

  var errors = []
  if (data.info.has_geo_data == false) {
    errors.push('! Unable to fetch parkrun event location data: Stats, Challenges, and Maps requiring locations are not available !')
  }
  if (data.info.has_geo_technical_event_data == false) {
    errors.push('! Unable to fetch parkrun event status data: Stats and Challenges, e.g. Regionnaire, may include events that haven\'t started yet !')
  }


  // Add our final status message
  set_complete_progress_message(errors)

}).catch(error => {
  console.log(error)
  console.error(`An error occurred: ${error}`);
  set_progress_message(`Error: ${error}`)
});

function get_athlete_id() {
    // Very basic method to get only the parameter we care about
    var page_parameters = window.location.search
    var athlete_id = undefined
    if (page_parameters.includes('athleteNumber=')) {
        athlete_id = page_parameters.split('athleteNumber=')[1].split('&')[0]
    }
    console.log('Athlete ID: '+athlete_id)
    return athlete_id
}
