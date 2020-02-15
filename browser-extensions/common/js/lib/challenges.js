
/*
 * Some volunteer roles have changed names, or a role has been deprecated,
 * or it makes sense to know a role by another name. This attempts to do that.
 * This has lots of problems, such as the ability to display them in a language
 * other than English, but that's how it currently works.
 */

volunteer_roles_map = [
    {"shortname": "equipment-storage", "name": "Equipment Storage and Delivery"},
    {"shortname": "comms-person", "name": "Communications Person"},
    {"shortname": "volunteer-coordinator", "name": "Volunteer Co-ordinator"},
    {"shortname": "event-day-course-check", "name": "Event Day Course Check"},
    {"shortname": "setup", "name": "Pre-event Setup"},
    {"shortname": "car-park-marshal", "name": "Car Park Marshal"},
    {"shortname": "first-timers-briefing", "name": "First Timers Briefing"},
    {"shortname": "sign-language", "name": "Sign Language Support"},
    {"shortname": "marshal", "name": "Marshal"},
    {"shortname": "tail-walker", "name": "Tail Walker"},
    {"shortname": "run-director", "name": "Run Director"},
    {"shortname": "lead-bike", "name": "Lead Bike"},
    {"shortname": "pacer", "name": "Pacer", "matching-roles": ["Pacer (5k only)"]},
    {"shortname": "vi-guide", "name": "Guide Runner", "matching-roles": ["VI Guide"]},
    {"shortname": "photographer", "name": "Photographer"},
    {"shortname": "timer", "name": "Timer", "matching-roles": ["Timekeeper", "Backup Timer"]},
    {"shortname": "funnel-manager", "name": "Funnel Manager"},
    {"shortname": "finish-tokens", "name": "Finish Tokens & Support", "matching-roles": ["Finish Tokens", "Finish Token Support"]},
    {"shortname": "barcode-scanning", "name": "Barcode Scanning"},
    {"shortname": "manual-entry", "name": "Number Checker"},
    {"shortname": "close-down", "name": "Post-event Close Down"},
    {"shortname": "results-processing", "name": "Results Processor"},
    {"shortname": "token-sorting", "name": "Token Sorting"},
    {"shortname": "run-report-writer", "name": "Run Report Writer"},
    {"shortname": "other", "name": "Other"},
    {"shortname": "warm-up-leader", "name": "Warm Up Leader", "matching-roles": ["Warm Up Leader (junior events only)"]},
]

function group_volunteer_data(volunteer_data) {
  // Populate the results with the above

  grouped_volunteer_data = []

  volunteer_roles_map.forEach(function (role) {
    grouped_volunteer_data[role["name"]] = 0
    if (role["matching-roles"] !== undefined){
        for (var i=0; i<role["matching-roles"].length; i++) {
            if (role["matching-roles"][i] in volunteer_data) {
                grouped_volunteer_data[role["name"]] += volunteer_data[role["matching-roles"][i]]
            }
        }
    } else {
      if (role.name in volunteer_data) {
          // console.log("Completed "+role.name+" "+volunteer_data[role.name]+" times")
          grouped_volunteer_data[role["name"]] = volunteer_data[role.name]
      }
    }
  })

  return grouped_volunteer_data
}

/*
 * These functions provide a way to generate the data relating to challenge
 * based on the results provided to them. This includes if the challenge
 * is complete, how many subparts there are, and how far you have to go etc..
 */

function generate_running_challenge_data(data) {
  // console.log(data)
  challenge_data = []

  if (data.parkrun_results) {
    challenge_data.push(challenge_tourist(data, {
      "shortname": "tourist",
      "name": "parkrun Tourism",
      "data": {
        // These stages should not overlap.
        // If a stage has more that item in the 'count' field, it is considered something
        // that you can progress towards in fractions, before being awarded the final one.
        // This allows for more club additions as the tourism bug means that ever higher
        // achievements are being regularly recongnised.
        "stages": [
          {
            "shortname": "tourist",
            "name": "parkrun Tourist",
            "count": 20,
            "badge_icon": "runner-tourist"
          },
          {
            "shortname": "cowell",
            "name": "Cowell Club",
            "count": [
              {
                "count": 25,
                "name": "Quarter Cowell",
                "badge_icon": "runner-quarter-cowell-club"
              },
              {
                "count": 50,
                "name": "Half Cowell - a 'Cow'",
                "badge_icon": "runner-half-cowell-club"
              },
              {
                "count": 75,
                "name": "Three-Quarter Cowell",
                "badge_icon": "runner-three-quarter-cowell-club"
              },
              {
                "count": 100,
                "name": "Cowell",
                "badge_icon": "runner-cowell-club"
              }
            ]
          },
          {
            "shortname": "freyne",
            "name": "Freyne Club",
            "count": 250,
            "badge_icon": "runner-freyne-club"
          }
        ]
      },
      "help": "Run at different parkrun events all over the world! Get badges along your journey at 20,25,50,75,100, and 250 different events."}))
    challenge_data.push(challenge_start_letters(data, {
      "shortname": "alphabeteer",
      "name": "Alphabeteer",
      "data": "abcdefghijklmnopqrstuvwyz",
      "help": "Run at parkrun locations starting with each letter of the English alphabet (except X)."}))
    challenge_data.push(challenge_single_parkrun_count(data, 
      {
        "shortname": "double-ton",
        "name": "Tons of runs",
        "help": "Run 100+ or 200+ times at the same location.",
        "stages": [
          {
            "count": 100,
            "name": "Single-ton",
            "badge_icon": "runner-single-ton"
          },
          {
            "count": 200,
            "name": "Double-ton",
            "badge_icon": "runner-double-ton"
          }
        ]
      }))
    challenge_data.push(challenge_stopwatch_bingo(data, {
      "shortname": "stopwatch-bingo",
      "name": "Stopwatch Bingo",
      "help": " Collect all the seconds from 00 to 59 in your finishing times."}))
    challenge_data.push(challenge_start_letters(data, {
      "shortname": "pirates",
      "name": "Pirates!",
      "data": "cccccccr",
      "help": "Run seven Cs and an R (say it out loud)."}))
    challenge_data.push(challenge_start_letters(data, {
      "shortname": "stayin-alive",
      "name": "Stayin' Alive",
      "data": "bgbgbg",
      "help": "Run three Bees and three Gees."}))
    challenge_data.push(challenge_words(data, {
      "shortname": "compass-club",
      "name": "Compass Club",
      "data": ["north","south","east","west"],
      "help": " Run at a parkrun named after each of the four compass points."}))
    challenge_data.push(challenge_parkruns(data, {
      "shortname": "full-ponty",
      "name": "The Full Ponty",
      "data": ["Pontefract","Pontypool","Pontypridd","Pont y Bala"],
      "help": "Run at all the parkruns named ponty... or ponte..."}))
    challenge_data.push(challenge_parkruns(data, {
      "shortname": "pilgrimage",
      "name": "Bushy Pilgrimage",
      "data": ["Bushy Park"],
      "help": "Run at Bushy parkrun, where it all began."}))
    // Note for the dates, the month is zero indexed (0-11), the day of the month is (1-31)
    challenge_data.push(challenge_on_dates(data, {
      "shortname": "christmas-day",
      "name": "Christmas Day",
      "data": [
        {"month": 11, "day": 25}
      ],
      "help": "Run a parkrun on the 25th of December."}))
    challenge_data.push(challenge_nyd_double(data, {
      "shortname": "nyd-double",
      "name":  "NYD Double",
      "help": "Run two parkruns on one New Year's Day."}))
    challenge_data.push(challenge_groundhog_day(data, {
      "shortname": "groundhog-day",
      "name": "Groundhog Day",
      "help": "Finish with the same time at the same parkrun location on two consecutive parkruns."}))
    challenge_data.push(challenge_on_dates(data, {
      "shortname": "all-weather-runner",
      "name": "All Weather Runner",
      "data": [
        {"month": 0},
        {"month": 1},
        {"month": 2},
        {"month": 3},
        {"month": 4},
        {"month": 5},
        {"month": 6},
        {"month": 7},
        {"month": 8},
        {"month": 9},
        {"month": 10},
        {"month": 11},
      ],
      "help": "Run in each month of the year."}))
    challenge_data.push(challenge_obsessive(data,
      {
        "shortname": "obsessive-gold",
        "name": "parkrun Obsessive",
        "help": "Run at 30+ (bronze), 40+ (silver), or 50+(gold) parkruns in a calendar year.",
        "stages": [
          {
            "count": 30,
            "name": "Bronze",
            "badge_icon": "runner-obsessive-bronze"
          },
          {
            "count": 40,
            "name": "Silver",
            "badge_icon": "runner-obsessive-silver"
          },
          {
            "count": 50,
            "name": "Gold",
            "badge_icon": "runner-obsessive-gold"
          }
        ]
      }))
    challenge_data.push(challenge_regular_running(data, {
      "shortname": "regular-running-day",
      "name": "Regular Running",
      "help": "Build a running community by running at an event every year since you first attended."}))
  }

  // if (data.parkrun_results && data.geo_data) {
  //   challenge_data.push(challenge_by_region(data, {
  //     "shortname": "regionnaire",
  //     "name": "Regionnaire",
  //     "help": "Run all the parkrun locations in a geographical region."}))
  // }

  return challenge_data
}

function generate_volunteer_challenge_data(data) {

  var volunteer_challenge_data = []

  if (data.volunteer_data) {
    volunteer_data = data.volunteer_data

    volunteer_roles = group_volunteer_data(volunteer_data)

    // Populate the results with the above
    volunteer_roles_map.forEach(function (role) {
        var this_role_data = create_data_object(role, "volunteer")
        this_role_data.summary_text = ""
        this_role_data.subparts_completed_count = volunteer_roles[role["name"]]
        if (this_role_data.subparts_completed_count > 0) {
            this_role_data.summary_text = "x"+this_role_data.subparts_completed_count
            this_role_data.complete = true
        } else {
            this_role_data.summary_text = '-'
        }

        update_data_object(this_role_data)
        volunteer_challenge_data.push(this_role_data)
    })
  }

  return volunteer_challenge_data
}

// Function adapted from https://www.movable-type.co.uk/scripts/latlong.html
function calculate_great_circle_distance(point1, point2) {

  if (point1.lat == '' || point1.lon == '' || point2.lat == '' || point2.lon == '') {
    return 0
  }

  var R = 6371; // km
  var φ1 = point1.lat * Math.PI / 180;
  var φ2 = point2.lat * Math.PI / 180;
  var Δφ = (point2.lat-point1.lat) * Math.PI / 180;
  var Δλ = (point2.lon-point1.lon) * Math.PI / 180;

  var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ/2) * Math.sin(Δλ/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  var d = R * c;

  return d
}

// These stat generation functions are all separate for each of maintenance
// They would be quicker if they were all in one loop, but it makes testing
// and extending them harder

// How many runs in total
function generate_stat_total_runs(parkrun_results) {
  var total_runs = 0
  parkrun_results.forEach(function (parkrun_event) {
    // Count the total runs
    total_runs += 1
  })
  return {
    "display_name": "Total number of parkruns",
    "help": "The total number of parkruns completed.",
    "value": total_runs
  }
}

// How many PBs in total
function generate_stat_total_pbs(parkrun_results) {
  var total_pbs = 0
  parkrun_results.forEach(function (parkrun_event) {
    // Count the number of PBs
    if (parkrun_event.pb) {
      total_pbs += 1
    }
  })
  return {
    "display_name": "Total PBs",
    "help": "The total number of PBs achieved across all parkruns.",
    "value": total_pbs
  }
}

// Maximum number of consecutive PBs in the results table
function generate_stat_longest_pb_streak(parkrun_results) {
  var longest_pb_streak = 0
  var this_pb_streak = 0
  parkrun_results.forEach(function (parkrun_event) {
    // Count the number of consecutive PBs
    if (parkrun_event.pb) {
      // Increment this PB streak, and if it exceeds the max, make it that too
      this_pb_streak += 1
      if (this_pb_streak > longest_pb_streak) {
        longest_pb_streak = this_pb_streak
      }
    } else {
      // Reset the PB streak
      this_pb_streak = 0
    }
  })
  return {
    "display_name": "Longest PB streak",
    "help": "The highest number of consecutive PBs achieved across all parkrun events.",
    "value": longest_pb_streak + " parkruns"
  }
}

// Sum of all parkrun distances ran, +5km for regular, +2km if there is 'junior'
// in the name of the event
function generate_stat_total_distance_ran(parkrun_results) {
  var total_distance_ran = 0
  parkrun_results.forEach(function (parkrun_event) {
    // Find the distance this athlete has run (juniors is 2k, else 5k)
    if (parkrun_event.name.toLowerCase().includes('juniors')) {
      total_distance_ran += 2
    } else {
      total_distance_ran += 5
    }
  })
  return {
    "display_name": "Total parkrun distance",
    "help": "The total distance achieved from adding up 5k for a parkrun, and 2k for a junior parkrun.",
    "value": total_distance_ran+"km"
  }
}

// Maximum number of runs in a calendar year, as determined from the date
// run in the results table
function generate_stat_most_runs_in_a_year(parkrun_results) {
  var runs_per_year = {}
  var value = "None"
  // Group results by year
  parkrun_results.forEach(function (parkrun_event) {
    if (!(parkrun_event.date_obj.getUTCFullYear() in runs_per_year)) {
      runs_per_year[parkrun_event.date_obj.getUTCFullYear()] = 0
    }
    runs_per_year[parkrun_event.date_obj.getUTCFullYear()] += 1
  })
  // Sort years by number of runs descending
  var best_year_sorted = Object.keys(runs_per_year).sort(function(a, b) {
      return runs_per_year[b] - runs_per_year[a]
  })
  // Find all the years with the maximum value
  var best_years = []
  if (best_year_sorted.length > 0) {
    best_year_sorted.forEach(function (year){
      if (runs_per_year[year] == runs_per_year[best_year_sorted[0]]) {
        best_years.push(year)
      }
    })
    value = runs_per_year[best_year_sorted[0]] + " in " + best_years.join(", ")
  }

  return {
    "display_name": "Most parkruns in a year",
    "help": "The highest number of parkruns attended in a calendar year.",
    "value": value
  }
}

// The number of parkruns that satisfy the equation 'p parkruns run at least p times'
// E.g. you have run 4 different parkruns at least 4 times.
function generate_stat_p_index(parkrun_results) {
  var p_index = 0
  var event_attendance_tally = {}

  parkrun_results.forEach(function (parkrun_event) {
    if (!(parkrun_event.name in event_attendance_tally)) {
      event_attendance_tally[parkrun_event.name] = 0
    }
    event_attendance_tally[parkrun_event.name] += 1
  })
  // Sort events by number of runs descending
  var event_attendance_sorted = Object.keys(event_attendance_tally).sort(function(a, b) {
      return event_attendance_tally[b] - event_attendance_tally[a]
  })
  // Iterate through the events, and as long as the numbers of times we have
  // run at the even is greater than the index value, increment the p-index
  event_attendance_sorted.forEach(function(event_name, index) {
    if (event_attendance_tally[event_name] > index) {
      p_index += 1
    }
  })
  return {
    "display_name": "p-index",
    "help": "The number of parkruns that satisfy the equation 'p parkruns run at least p times', e.g. if you have run 4 different parkruns at least 4 times each, your p-index is 4.",
    "value": p_index
  }
}

// The number of volunteer roles which have been performed at least _v_ times.
// E.g. If you have volunteered in 4 different roles at least 4 times, your v-index
// is 4.
function generate_stat_v_index(volunteer_data) {

  volunteer_roles = group_volunteer_data(volunteer_data)

  var v_index = 0
  var descending_tally = Object.keys(volunteer_roles).sort(function(a, b) {
    return volunteer_roles[b] - volunteer_roles[a]
  })
  // Iterate through the roles, and as long as the number of times we have
  // volunteered in the role is greater than the index value, increment the
  // v-index
  descending_tally.forEach(function(role_name, index) {
    // console.log("index: " + index + " is " + role_name + " which has been completed " + volunteer_roles[role_name] + " times")
    if (volunteer_roles[role_name] > index) {
      v_index += 1
    }
  })
  return {
    "display_name": "v-index",
    "help": "The number of volunteer roles which have been performed at least v times. E.g. If you have volunteered in 4 different roles at least 4 times, your v-index is 4.",
    "value": v_index
  }
}

// The maximum contiguous series of parkrun event numbers you have attended
// (at any event), starting at 1.
function generate_stat_wilson_index(parkrun_results) {
  var wilson_index = 0
  var event_numbers_visited = {}

  parkrun_results.forEach(function (parkrun_event) {
    event_numbers_visited[parkrun_event.event_number] = true
  })
  // Iterate through the maximum set of event numbers they could have, and check
  // if each is in the object, we stop when we can't find one
  var index
  for (index=1; index<Object.keys(event_numbers_visited).length; index++) {
    if (index in event_numbers_visited) {
      wilson_index += 1
    } else {
      break
    }
  }
  return {
    "display_name": "wilson-index",
    "help": "The maximum contiguous series of parkrun event numbers you have attended (at any event), starting at 1.",
    "value": wilson_index
  }
}

// What date was this athlete's first run
function generate_stat_parkrun_birthday(parkrun_results) {
  var birthday = "-"
  if (parkrun_results.length > 0) {
    birthday_date = parkrun_results[0].date_obj
    // Format the date as a string with the user's locale
    // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString
    // for more options
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' };
    // In en-GB this gives something like : "Thursday, 20 December 2012"
    // in en-US it would be "Thursday, December 20, 2012"
    // in pl-PL it would be "czwartek, 20 grudnia 2012"
    birthday = birthday_date.toLocaleDateString(undefined, options);
  }
  return {
    "display_name": "parkrun birthday",
    "help": "The date of your first parkrun!",
    "value": birthday
  }
}

// Total number of years parkrunning, if today if your anniversary it will go up
function generate_stat_years_parkrunning(parkrun_results) {
  var years = 0
  if (parkrun_results.length > 0) {
    var birthday_date = parkrun_results[0].date_obj
    var now = new Date()
    // .getDay() and .getUTCDay() returns the day of the week (0-6)
    // .getDate() and .getUTCDate() returns the day of the month (1-31)
    // So be careful when comparing!
    // Also, make sure to use the non-UTC version for today's date
    // which is in the user's locale, and use the UTC version for 
    // any dates parsed from website and therefore stored in UTC.
    if (now.getMonth() > birthday_date.getUTCMonth() || (now.getMonth() == birthday_date.getUTCMonth() && now.getDate() >= birthday_date.getUTCDate())) {
      years = now.getFullYear() - birthday_date.getUTCFullYear()
    } else {
      years = now.getFullYear() - birthday_date.getUTCFullYear() - 1
    }
  }
  return {
    "display_name": "Years parkrunning",
    "help": "How many full years you have been going to parkrun since your first event.",
    "value": years
  }
}

function generate_stat_events_run(parkrun_results) {
  // Find those parkrun events that have been completed
  var events_run = {}

  parkrun_results.forEach(function (parkrun_event) {
    if (!(parkrun_event.name in events_run)) {
      events_run[parkrun_event.name] = true
    }
  })

  return {
    "display_name": "Events run",
    "help": "The number of different parkrun events you have attended.",
    "value": Object.keys(events_run).length
  }
}

// A percentage showing how many of the events you have run at are new events,
// i.e someone who never repeats an event is at 100%, and someone who never
// leaves home approaches 0%.
function generate_stat_tourist_quotient(parkrun_results) {
  // Find those parkrun events that have been completed
  var events_run = {}
  var tourist_quotient = "-"

  parkrun_results.forEach(function (parkrun_event) {
    if (!(parkrun_event.name in events_run)) {
      events_run[parkrun_event.name] = true
    }
  })

  var event_count = Object.keys(events_run).length
  if (parkrun_results.length > 0) {
    tourist_quotient =  (100 * event_count / parkrun_results.length).toFixed(2) + "%"
  }

  return {
    "display_name": "Tourist Quotient",
    "help": "The percentage of parkrun events attended that you had not been to before. If you never repeat a parkrun event it will be 100%, if you never tourist at all it will head towards 0%.",
    "value": tourist_quotient
  }
}

// Maximum number of consecutive different parkrun events
function generate_stat_longest_tourism_streak(parkrun_results) {
  var t_streak = 0
  let event_streak = []

  parkrun_results.forEach(function (parkrun_event, index) {

    // If we get a duplicate parkrun, chop off the start of the streak
    // up until the streak becomes unique again.
    //
    // e.g.
    // [1,2,3,4] - going to add [1]
    // will chop off the first element with splice(0,1)
    // [1,2,3,4,5,6] - going to add [3]
    // will chop off the first 3 elements
    if (event_streak.includes(parkrun_event.name)) {

      var f = 0
      var filteredElements = event_streak.some(function(item, index) {
         f = index; return item == parkrun_event.name
      })

      event_streak.splice(0,f+1)

    }

    // Add the new parkrun in - it will be unique in the list as we removed the
    // existing entries in the list above.
    event_streak.push(parkrun_event.name)
    t_streak = Math.max(t_streak, event_streak.length)

  })
  return {
    "display_name": "Longest tourism streak",
    "help": "The highest number of consecutive different events attended.",
    "value": t_streak + " parkruns"
  }
}

function generate_stat_runs_this_year(parkrun_results) {
  // Find those parkrun events that have been completed
  var runs_this_year = 0
  var now = new Date()

  parkrun_results.forEach(function (parkrun_event) {
    if (parkrun_event.date_obj.getUTCFullYear() == now.getFullYear()) {
      runs_this_year += 1
    }
  })

  return {
    "display_name": "parkruns this year",
    "help": "How many parkrun events you have got a time at this calendar year.",
    "value": runs_this_year
  }
}

// Total distance between parkruns that you have run - a measure of how much
// you have travelled to go to parkrun!
function generate_stat_total_distance_travelled(parkrun_results, geo_data) {
  var total_distance_travelled = 0
  var previous_event_location = undefined
  parkrun_results.forEach(function (parkrun_event) {

    // Work out how far the parkrunner has travelled (between consecutive events)
    if (geo_data.data.events[parkrun_event.name] !== undefined) {
      var event_location_info = geo_data.data.events[parkrun_event.name]
      // We need to know the previous event location to work out the distance
      // so we keep track of this separately to the previous event - in case we
      // don't know where someone inbetween is
      if (previous_event_location !== undefined) {
        // Compare the names of the parkruns and don't compute the distance if they
        // are the same - it should be fine without this, but we might get odd
        // small numbers being added if there are rounding errors
        if (parkrun_event.name != previous_event_location.name) {
          // Both event_location_info and previous_event_location have properties
          // of .lat and .lon, so we can pass them to this function
          // These distances can clock up fast if you regularly visit friends and
          // family in different parts of the country. A weekend in Manchester
          // from Winchester could easily add on another 250km for two consecutive
          // weeks
          total_distance_travelled += Math.round(calculate_great_circle_distance(event_location_info, previous_event_location))
        }
      }
      // Store where we were this week for next time
      previous_event_location = event_location_info
    }
  })

  return {
    "display_name": "Total distance travelled",
    "help": "The cumulative distance you have travelled between each parkrun event.",
    "value": total_distance_travelled + "km"
  }
}

// Count of the number of distinct countries you have visited
function generate_stat_total_countries_visited(parkrun_results, geo_data) {
  var parkrun_countries_visited = {}
  parkrun_results.forEach(function (parkrun_event) {

    // Work out how many countries have been visited
    if (geo_data.data.events[parkrun_event.name] !== undefined) {
      var event_location_info = geo_data.data.events[parkrun_event.name]
      if (event_location_info.country_name != 'unknown') {
        if (!(event_location_info.country_name in parkrun_countries_visited)) {
          parkrun_countries_visited[event_location_info.country_name] = true
        }
      }
    }
  })

  return {
    "display_name": "Countries visited",
    "help": "The total number of countries that you have parkrunned in.",
    "value": Object.keys(parkrun_countries_visited).length
  }
}

// Calculate average lat/lon of all parkruns completed
function generate_stat_average_parkrun_location(parkrun_results, geo_data) {
  var lat_sum = 0
  var lon_sum = 0
  var count = 0

  parkrun_results.forEach(function (parkrun_event) {
    // Is this parkrun still live (know where it is), and has it got a location we can do something with?
    if (parkrun_event.name in geo_data.data.events) {
      var event_location_info = geo_data.data.events[parkrun_event.name]
      if (event_location_info.lat && event_location_info.lon) {
        lat_sum += parseFloat(event_location_info.lat)
        lon_sum += parseFloat(event_location_info.lon)
        count += 1
      }
    }
  })

  var value = "None"
  var url_link = undefined
  if (count > 0) {
    var lat_av = (lat_sum/count).toFixed(5)
    var lon_av = (lon_sum/count).toFixed(5)
    value =  lat_av + "," + lon_av
    // Provide a link to an openstreetmap with a marker in the location
    url_link = "https://www.openstreetmap.org/?mlat="+lat_av+"&mlon="+lon_av+"#map=9/"+lat_av+"/"+lon_av
  }

  return {
    "display_name": "Average parkrun lat/lon location",
    "help": "The average latitude/longitude of all your parkrun attendances.",
    "value": value,
    "url": url_link
  }
}


// Calculate average parkrun location
function calculate_average_parkrun_location(parkrun_results, geo_data) {
var lat_sum = 0
  var lon_sum = 0
  var count = 0
  var lat_av = ''
  var lon_av = ''
  var average_location = undefined

  parkrun_results.forEach(function (parkrun_event) {
    // Is this parkrun still live (know where it is), and has it got a location we can do something with?
    if (parkrun_event.name in geo_data.data.events) {
      var event_location_info = geo_data.data.events[parkrun_event.name]
      if (event_location_info.lat && event_location_info.lon) {
        lat_sum += parseFloat(event_location_info.lat)
        lon_sum += parseFloat(event_location_info.lon)
        count += 1
      }
    }
  })

  if (count > 0) {
    lat_av = (lat_sum/count)
    lon_av = (lon_sum/count)
    average_location = {
      "lat" : lat_av,
      "lon" : lon_av
    }
  }

  return average_location
}

// What's the URL of the parkrun's webpage?
function get_parkrun_page_url(geo_data, parkrun_name) {
  parkrun_page_url = undefined
  if (geo_data.data !== undefined) {
    if (parkrun_name in geo_data.data.events) {
      parkrun_shortname = geo_data.data.events[parkrun_name].shortname
      country_name = geo_data.data.events[parkrun_name].country_name
      if (country_name in geo_data.data.countries) {
        domain_url = geo_data.data.countries[country_name].url
        parkrun_page_url = "https://" + domain_url + "/" + parkrun_shortname
      }
    }
  }
  return parkrun_page_url
}

// Which is the closest parkrun to your average parkrun location?
function generate_stat_average_parkrun_event(parkrun_results, geo_data) {
  // Calculate average parkrun for user
  var average_parkrun_location = calculate_average_parkrun_location(parkrun_results, geo_data)
  var average_parkrun_event_name = undefined
  var average_parkrun_event_distance = undefined

  var average_parkrun_stat_info = {
    "display_name": "Average parkrun event",
    "help": "The nearest parkrun event to your average parkrun location.",
    "value": "None"
  }

  if (average_parkrun_location !== undefined) {

    // For each parkrun event, get the event's information, which includes its lon and lat.
    Object.keys(geo_data.data.events).forEach(function(event_name) {
      var event_location_info = geo_data.data.events[event_name]
      // For each parkrun event, calculate the 3D distance between the event and the user's average parkrun location
      var distance = calculate_great_circle_distance(event_location_info, average_parkrun_location)
      // If the distance to the event from the average parkrun location is less than the distance currently stored, store the event
      if (average_parkrun_event_distance == undefined || distance < average_parkrun_event_distance) {
        average_parkrun_event_name = event_name
        average_parkrun_event_distance = distance
      }
    })

    var url_link = get_parkrun_page_url(geo_data, average_parkrun_event_name)
    
    average_parkrun_stat_info = {
      "display_name": "Average parkrun event",
      "help": "The nearest parkrun event to your average parkrun location.",
      "value": average_parkrun_event_name,
      "url": url_link
    }
  }
  return average_parkrun_stat_info
}

// Furthest parkrun you have run away from your home parkrun
function generate_stat_furthest_travelled(parkrun_results, geo_data, home_parkrun) {
  furthest_travelled = {
    'parkrun_event': undefined,
    'distance': undefined
  }

  parkrun_results.forEach(function (parkrun_event) {
    // Work out how far the parkrunner has travelled to this location
    var event_location_info = geo_data.data.events[parkrun_event.name]
    if (event_location_info !== undefined) {
      var distance = Math.round(calculate_great_circle_distance(event_location_info, home_parkrun))
      if (furthest_travelled.distance === undefined || distance > furthest_travelled.distance) {
        furthest_travelled.distance = distance
        furthest_travelled.parkrun_event = event_location_info
      }
    }
  })

  // Default to "None" If they haven't run any parkruns, or "Unknown" if they have - as it might be that we 
  // don't know where the parkruns they have done, are.
  stat_info = {
    "display_name": "Furthest travelled",
    "help": "The furthest away parkrun you have been to (calculated from your home parkrun).",
    "value": parkrun_results.length > 0 ? "Unknown" : "None"
  }

  if (furthest_travelled.parkrun_event !== undefined) {
    stat_info["value"] = furthest_travelled.parkrun_event.name + ", " + furthest_travelled.parkrun_event.country_name
    stat_info["url"] = get_parkrun_page_url(geo_data, furthest_travelled.parkrun_event.name)
  }

  return stat_info
}

// Which is the closest parkrun you haven't done yet
function generate_stat_nearest_event_not_done_yet(parkrun_results, geo_data, home_parkrun_info) {
  // Find those parkrun events that have been completed
  var events_run = {}

  parkrun_results.forEach(function (parkrun_event) {
    if (!(parkrun_event.name in events_run)) {
      events_run[parkrun_event.name] = true
    }
  })
  var event_distances = {}

  
  // Remove the JQuery dependency
  // $.each(geo_data.data.events, function (event_name, event_info) {
  Object.keys(geo_data.data.events).forEach(function(event_name) {
    var event_info = geo_data.data.events[event_name]
    if (!(event_name in events_run)) {
      if ((event_info.status == 'Live' || event_info.status == 'unknown') && event_info.lat && event_info.lon) {
        event_distances[event_name] = calculate_great_circle_distance(event_info, home_parkrun_info)
      }
    }
  })

  // Sort the list of events not done by distance
  var sorted_events = Object.keys(event_distances).sort(function(a, b) {
      return event_distances[a] - event_distances[b]
  })

  var statInfo =  {
    "display_name": "Nearest event not done yet (NENDY)",
    "help": "The nearest parkrun event to your home parkrun that you have not done yet.",
    "value": "No more events available"
  }

  if (sorted_events.length > 0) {
    var nendy_name = sorted_events[0]
    var nendy = geo_data.data.events[nendy_name]
    statInfo.value = nendy.name + ", " + nendy.country_name+ " - " + Math.round(event_distances[nendy_name]) + "km away"
    statInfo["url"] = get_parkrun_page_url(geo_data, nendy.name)
  }

  return statInfo
}

// How many times has your name appeared on the volunteer roster (note, not the
// same as volunteer club progress, as this takes into account multiple roles
// per week)
function generate_stat_total_volunteer_roles(volunteer_data) {
  var total_volunteer_roles = 0
  $.each(volunteer_data, function (role, count) {
    total_volunteer_roles += count
  })
  return {
    "display_name": "Total volunteer roles",
    "help": "The total number of times your name has appeared next to a role on the volunteer roster - note this includes the fact you can get multiple credits per week, and does not indicate your eligibility for a milestone shirt.",
    "value": total_volunteer_roles
  }
}

// How many of the different volunteer roles have you done
function generate_stat_total_distinct_volunteer_roles(volunteer_data) {
  return {
    "display_name": "Total distinct volunteer roles",
    "help": "How many of the different volunteering roles have been completed.",
    "value": Object.keys(volunteer_data).length
  }
}


function generate_stats(data) {

  stats = {}

  // Stats that only need the list of parkruns
  if (data.info.has_parkrun_results) {
    stats['total_runs'] = generate_stat_total_runs(data.parkrun_results)
    stats['total_pbs'] = generate_stat_total_pbs(data.parkrun_results)
    stats['longest_pb_streak'] = generate_stat_longest_pb_streak(data.parkrun_results)
    stats['total_distance_ran'] = generate_stat_total_distance_ran(data.parkrun_results)
    stats['most_runs_in_a_year'] = generate_stat_most_runs_in_a_year(data.parkrun_results)
    stats['runs_this_year'] = generate_stat_runs_this_year(data.parkrun_results)
    stats['p_index'] = generate_stat_p_index(data.parkrun_results)
    stats['wilson_index'] = generate_stat_wilson_index(data.parkrun_results)
    stats['parkrun_birthday'] = generate_stat_parkrun_birthday(data.parkrun_results)
    stats['years_parkrunning'] = generate_stat_years_parkrunning(data.parkrun_results)
    stats['events_run'] = generate_stat_events_run(data.parkrun_results)
    stats['tourist_quotient'] = generate_stat_tourist_quotient(data.parkrun_results)
    stats['tourism_streak'] = generate_stat_longest_tourism_streak(data.parkrun_results)
  }

  // Stats that need a list of parkruns, and additional geo data to determine where they are
  if (data.info.has_parkrun_results && data.info.has_geo_data) {
    stats['total_distance_travelled'] = generate_stat_total_distance_travelled(data.parkrun_results, data.geo_data)
    stats['total_countries_visited'] = generate_stat_total_countries_visited(data.parkrun_results, data.geo_data)
    stats['average_parkrun_location'] = generate_stat_average_parkrun_location(data.parkrun_results, data.geo_data)
    stats['average_parkrun_event'] = generate_stat_average_parkrun_event(data.parkrun_results, data.geo_data)
  }

  // Stats that need the user data available, and we are on their page (i.e. has
  // to be the person who has installed the plugin)
  if (data.info.has_parkrun_results && data.info.has_geo_data && data.info.is_our_page && data.info.has_home_parkrun) {
    stats['furthest_travelled'] = generate_stat_furthest_travelled(data.parkrun_results, data.geo_data, data.user_data.home_parkrun_info)
    stats['nearest_event_not_done_yet'] = generate_stat_nearest_event_not_done_yet(data.parkrun_results, data.geo_data, data.user_data.home_parkrun_info)
  }

  // Stats based off the volunteer data
  if (data.info.has_volunteer_data) {
    stats['total_volunteer_roles'] = generate_stat_total_volunteer_roles(data.volunteer_data)
    stats['total_distinct_volunteer_roles'] = generate_stat_total_distinct_volunteer_roles(data.volunteer_data)
    stats['v_index'] = generate_stat_v_index(data.volunteer_data)
  }

  return stats
}

function get_initial_letter(event_name) {
  return event_name[0].toLowerCase()
}

function get_flag_image_src(country) {
  // Mapping countries to flag image files
  var flag_map = {
      "New Zealand": "nz",
      "Australia": "au",
      "Canada": "ca",
      "Denmark": "dk",
      "Finland": "fi",
      "France": "fr",
      "Germany": "de",
      "Iceland": "is",
      "Ireland": "ie",
      "Italy": "it",
      "Japan": "jp",
      "Malaysia": "my",
      "Namibia": "na",
      "Netherlands": "nl",
      "New Zealand": "nz",
      "Norway": "no",
      "Poland": "pl",
      "Russia": "ru",
      "Singapore": "sg",
      "South Africa": "za",
      "Swaziland": "sz",
      "Sweden": "se",
      "UK": "gb",
      "USA": "us",
      "Zimbabwe": "zw",
      "World": "world"
  }

  var flag_src = browser.extension.getURL("/images/flags/flag-unknown.png")

  if (country in flag_map) {
    flag_src = browser.extension.getURL("/images/flags/"+flag_map[country]+".png")
  }

  return flag_src

}

function generate_global_tourism_data(parkrun_results, geo_data) {
    // Generate essentially the same results as the regionnaire challenge all over again
    // console.log("generate_global_tourism_data()")
    var global_tourism = []



    regions = geo_data.data.regions
    events_completed_map = group_results_by_event(parkrun_results)
    sorted_region_heirachy = calculate_child_regions(regions, events_completed_map, "World")

    sorted_region_heirachy.child_regions.sort().forEach(function(top_level_country) {
        // Skip the world
        if (top_level_country.name == "World") {
            return
        }

        var country_info = {
            "name": top_level_country.name,
            "visited": false,
            "first_visited": top_level_country.first_ran_on,
            "icon": get_flag_image_src(top_level_country.name)
        }

        var child_events = find_region_child_events(top_level_country)

        if (top_level_country.child_events_completed_count > 0) {
            country_info["visited"] = true
        }
        global_tourism.push(country_info)
    })
    return global_tourism
}

function find_region_child_events(region, events=[]) {
    // Add the direct child events of this region
    region.child_events.forEach(function (region_event) {
        events.push(region_event)
    })
    // Further query all the child regions of this region
    region.child_regions.forEach(function (child_region) {
        find_region_child_events(child_region, events)
    })
    return events
}

function create_data_object(params, category) {
    var o = {
        "shortname": params.shortname,
        "name": params.name,
        "help": params.help,
        "start_time": new Date(),
        "complete": false,
        "completed_on": null,
        "subparts": [],
        "subparts_completed_count": 0,
        "subparts_detail": [],
        "badge_icon": category+"-"+params.shortname,
        // Which events have contributed to this challenge?
        // - a list of names
        "completed_qualifying_events": {},
        // Which are the closest events that could contribute to this challenge
        // in order to complete it
        // - a list of names
        "nearest_qualifying_events": {},
        // All of the qualifying events for this challenge
        // - a list of names
        "all_qualifying_events": {},
        // Whether this challenge has something you can map
        "has_map": false,
        // Where the reference home parkrun is, if available
        "home_parkrun": undefined
    }
    return o
}

function update_data_object(o) {
    o['stop_time'] = new Date()
    o['duration'] = o.stop_time - o.start_time
    o['subparts_count'] = o.subparts.length
    // console.log("Completed data for " + o.shortname + " in " + o['duration'] + "ms")
    return o
}

// Group all parkruns completed by event
function group_results_by_event(parkrun_results) {

    events = {}
    parkrun_results.forEach(function (parkrun_event) {
        // Create an empty list if we haven"t seen this parkrun before
        if (!(parkrun_event.name in events)) {
            events[parkrun_event.name] = []
        }
        // Append this instance to the appropriate event list
        events[parkrun_event.name].push(parkrun_event)
    });

    return events
}

function event_contains_word(event_name, word) {
  if (event_name.toLowerCase().indexOf(word) != -1) {
    return true
  }
}

function group_global_events_by_containing_word(geo_data, words) {

  var events = {}

  $.each(words, function(index, word) {
    events[word] = []
  })

  $.each(geo_data.data.events, function (event_name, event_info) {
    if (event_info.status == 'Live' || event_info.status == 'unknown') {
      $.each(words, function(index, word) {
        if (event_contains_word(event_name, word)) {
          events[word].push(event_info)
        }
      })
    }
  })

  return events

}

function group_global_events_by_initial_letter(geo_data) {

  var events = {}

  $.each(geo_data.data.events, function (event_name, event_info) {
    if (event_info.status == 'Live' || event_info.status == 'unknown') {
      event_letter = get_initial_letter(event_info["shortname"])
      if (events[event_letter] === undefined) {
        events[event_letter] = []
      }
      events[event_letter].push(event_info)
    }
  })

  return events

}


function sort_events_by_distance(events, from_location) {

  console.log("sort_events_by_distance()")
  var sorted_events = []

  // If we have a unusable from location, return straight away
  if (from_location == undefined || from_location.lat == undefined || from_location.lon == undefined) {
    return sorted_events
  }

  // Only process those events with locations - they should all have locations,
  // but if they don't, there isn't a lot we can do
  events_with_location_info = []
  $.each(events, function(event_name, event_info) {
    if (event_info.lat && event_info.lon) {
      events_with_location_info.push({
        "name": event_name,
        "distance": calculate_great_circle_distance(event_info, from_location),
        "lat": event_info.lat,
        "lon": event_info.lon
      })
    }
  })

  sorted_events = events_with_location_info.sort(function(event_a, event_b) {
      return event_a.distance - event_b.distance
  })

  // console.log(sorted_events)
  return sorted_events

}

function sort_grouped_events_by_distance(grouped_events, from_location) {
  var sorted_events = {}

  // If we have a unusable from location, return straight away
  if (from_location == undefined || from_location.lat == undefined || from_location.lon == undefined) {
    return sorted_events
  }

  $.each(grouped_events, function (group, event_list) {

    // Only process those events with locations - they should all have locations,
    // but if they don't, there isn't a lot we can do
    events_with_location_info = []
    $.each(event_list, function(index, event) {
      if (event.lat && event.lon) {
        events_with_location_info.push(event)
      }
    })

    // Sort the list of places with locations by their distance from the
    // from_location provided
    sorted_events[group] = events_with_location_info.sort(function(event_a, event_b) {
        return calculate_great_circle_distance(event_a, from_location) - calculate_great_circle_distance(event_b, from_location)
    })
  })

  return sorted_events

}

function get_parkrun_event_details(data, parkrun_name) {
  // Standard information
  var parkrun_event_details = {
    "name": parkrun_name
  }
  // Everything else needs geo data
  if (data.info.has_geo_data) {
    // Add the location in if we have it
    if (parkrun_name in data.geo_data.data.events) {
      geo_event = data.geo_data.data.events[parkrun_name]
      if (geo_event.lat && geo_event.lon) {
        parkrun_event_details.lat = geo_event.lat
        parkrun_event_details.lon = geo_event.lon
        // Now we have the location, we can also add in the distance to our
        // home parkrun, if we have set that, and we are looking at our page
        if (data.info.is_our_page && data.info.has_home_parkrun) {
          parkrun_event_details.distance = calculate_great_circle_distance(geo_event, get_home_parkrun(data))
        }
      }
      if (geo_event.local_url && geo_event.shortname) {
        parkrun_event_details.event_url = geo_event.local_url + '/' + geo_event.shortname
      }
    }
  }
  return parkrun_event_details
}

function challenge_start_letters(data, params) {

  // Find the data we are interested in
  parkrun_results = data.parkrun_results
  geo_data = data.geo_data
  user_data = data.user_data
  home_parkrun = undefined
  if (user_data) {
    home_parkrun = user_data.home_parkrun_info
  }

    var letters = params.data

    var o = create_data_object(params, "runner")
    o.has_map = true

    // Add all the subparts to the list
    for (i=0; i<letters.length; i++) {
        // Store each one as the parts we need to do
        o.subparts.push(letters[i])
        // Create placeholders for each contributing result
        o.subparts_detail.push(null)
    }

    checked_parkruns = []

    parkrun_results.forEach(function (parkrun_event) {

        if (!(checked_parkruns.includes(parkrun_event.name))) {
            initial_letter = parkrun_event.name[0].toLowerCase()
            // Skips those parkruns that aren't going to match at all
            if (o.subparts.includes(initial_letter)) {
                // Loop through all the letters we are looking for
                for (i=0; i<o.subparts.length; i++) {
                    // Find a matching subpart that hasn't yet been filled in
                    if (o.subparts_detail[i] == null && o.subparts[i] == initial_letter) {
                        // Add the event
                        p = Object.create(parkrun_event)
                        p.subpart = initial_letter
                        p.name = p.eventlink
                        p.info = p.datelink
                        o.subparts_detail[i] = p
                        o.subparts_completed_count += 1
                        if (!(parkrun_event.name in o.completed_qualifying_events)) {
                          o.completed_qualifying_events[parkrun_event.name] = get_parkrun_event_details(data, parkrun_event.name)
                        }

                        if (o.subparts.length == o.subparts_completed_count) {
                            o.complete = true
                            o.completed_on = p.date
                        }
                        // Get out of the for loop
                        break
                    }
                }
            }

            // Lets not process this parkrun again, even if we have run it more than once
            checked_parkruns.push(parkrun_event.name)
        }
    })

    // Group and sort the qualifying events
    grouped_events = {}
    sorted_grouped_events = {}
    if (geo_data) {
      grouped_events = group_global_events_by_initial_letter(geo_data)
      if (home_parkrun) {
        sorted_grouped_events = sort_grouped_events_by_distance(grouped_events, home_parkrun)
      }
    }

    // Add in all the missing ones
    for (i=0; i< o.subparts.length; i++) {
        if (o.subparts_detail[i] == null) {
            o.subparts_detail[i] = {
                "subpart": o.subparts[i],
                "info": "-"
            }


            // if (grouped_events !== undefined) {
            // Add those events for this letter
            if (o.subparts[i] in grouped_events) {
              $.each(grouped_events[o.subparts[i]], function (index, event) {
                // Don't add them if they are already there
                if (!(event.name in o.all_qualifying_events)) {
                  details = get_parkrun_event_details(data, event.name)
                  if (has_lat_lon(details)) {
                    o.all_qualifying_events[event.name] = details
                  }
                }
              })
            }
            // }

            // If this is our page (i.e. the athlete id in our profile matches
            // that of this page), then we can try and work out which are closest
            if (data.info.is_our_page) {
              // console.log(sorted_grouped_events)
              // if (sorted_grouped_events !== undefined) {
              if (o.subparts[i] in sorted_grouped_events) {
                // Add the first on that we haven't already added
                $.each(sorted_grouped_events[o.subparts[i]], function(index, event) {
                  // Only add it, and break out of the loop, if it is new
                  if (!(event.name in o.nearest_qualifying_events)) {
                    o.nearest_qualifying_events[event.name] = get_parkrun_event_details(data, event.name)
                    // Break out
                    return false
                  }
                })
              }
            }
            // }
        }
    }

    // console.log(o)

    // Return an object representing this challenge
    return update_data_object(o)
}

function challenge_words(data, params) {

  var parkrun_results = data.parkrun_results
    var word_array = params.data

    var o = create_data_object(params, "runner")
    o.has_map = true

    // Add all the subparts to the list
    word_array.forEach(function (word) {
        // Store each one as the parts we need to do
        o.subparts.push(word.toLowerCase())
        // Create placeholders for each contributing result
        o.subparts_detail.push(null)
    })

    // Group and sort the qualifying events
    // If we don't have the data, then the objects will be empty, and the checking
    // code will iterate over an empty objection
    grouped_events = {}
    sorted_grouped_events = {}
    if (data.info.has_geo_data) {
      grouped_events = group_global_events_by_containing_word(geo_data, o.subparts)
      if (data.info.has_home_parkrun && data.info.is_our_page) {
        sorted_grouped_events = sort_grouped_events_by_distance(grouped_events, data.user_data.home_parkrun_info)
      }
    }

    checked_parkruns = []

    parkrun_results.forEach(function (parkrun_event) {

        if (!(checked_parkruns.includes(parkrun_event.name))) {
            // Loop through all the words we are looking for
            for (i=0; i<o.subparts.length; i++) {
                // Find a matching subpart that hasn't yet been filled in
                if (o.subparts_detail[i] == null && parkrun_event.name.toLowerCase().indexOf(o.subparts[i]) != -1) {
                    // Add the event
                    p = Object.create(parkrun_event)
                    p.subpart = o.subparts[i]
                    p.name = p.eventlink
                    p.info = p.datelink
                    o.subparts_detail[i] = p
                    o.subparts_completed_count += 1

                    if (!(parkrun_event.name in o.completed_qualifying_events)) {
                      o.completed_qualifying_events[parkrun_event.name] = get_parkrun_event_details(data, parkrun_event.name)
                    }

                    if (o.subparts.length == o.subparts_completed_count) {
                        o.complete = true
                        o.completed_on = p.date
                    }
                    // Get out of the for loop
                    break
                }
            }


            // Lets not process this parkrun again, even if we have run it more than once
            checked_parkruns.push(parkrun_event.name)
        }
    })

    // Add in all the missing ones
    for (i=0; i< o.subparts.length; i++) {
        if (o.subparts_detail[i] == null) {
            o.subparts_detail[i] = {
                "subpart": o.subparts[i],
                "info": "-"
            }

            // If this is our page, and hence we know where the home parkrun is,
            // find out the closest event to complete this sub-part
            if (o.subparts[i] in sorted_grouped_events) {
              $.each(sorted_grouped_events[o.subparts[i]], function(index, event) {
                if (!(event.name in o.nearest_qualifying_events)) {
                  o.nearest_qualifying_events[event.name] = get_parkrun_event_details(data, event.name)
                  // Break out of the .each loop after we have found the closest
                  return false
                }
              })
            }

            if (o.subparts[i] in grouped_events) {
              // If we haven't added this event to the closest collection, then add it
              // to the all collection
              $.each(grouped_events[o.subparts[i]], function(index, event) {
                if (!(event.name in o.nearest_qualifying_events) && !(event.name in o.all_qualifying_events)) {
                  o.all_qualifying_events[event.name] = get_parkrun_event_details(data, event.name)
                }
              })
            }
        }
    }

    // Return an object representing this challenge
    return update_data_object(o)
}

function challenge_parkruns(data, params) {

  var parkrun_results = data.parkrun_results
    var parkrun_array = params.data

    var o = create_data_object(params, "runner")
    o.has_map = true

    // Add all the subparts to the list
    parkrun_array.forEach(function (parkrun_name) {
        // Store each one as the parts we need to do
        o.subparts.push(parkrun_name)//.toLowerCase())
        // Create placeholders for each contributing result
        o.subparts_detail.push(null)
    })

    events = group_results_by_event(parkrun_results)

    Object.keys(events).forEach(function (parkrun_name) {

        if (o.subparts.includes(parkrun_name)) {
            subparts_index = o.subparts.indexOf(parkrun_name)

            p = Object.create(events[parkrun_name][0])
            p.subpart = o.subparts[subparts_index]
            p.name = p.eventlink
            p.info = p.datelink
            o.subparts_detail[subparts_index] = p
            o.subparts_completed_count += 1
            if (!(parkrun_name in o.completed_qualifying_events)) {
              o.completed_qualifying_events[parkrun_name] = get_parkrun_event_details(data, parkrun_name)
            }

            if (o.subparts.length == o.subparts_completed_count) {
                o.complete = true
                o.completed_on = p.date
            }
        }
    })

    // Add in all the missing ones
    for (i=0; i< o.subparts.length; i++) {
        if (o.subparts_detail[i] == null) {
            o.subparts_detail[i] = {
                "subpart": o.subparts[i],
                "info": "-"
            }
            // Add all of the missing events to the 'all' collection, as it doesn't
            // really make a lot of sense for them to be in the 'closest' set,
            // as they are all the closest
            if (data.info.has_geo_data) {
              o.all_qualifying_events[o.subparts[i]] = get_parkrun_event_details(data, o.subparts[i])
            }
        }
    }

    // Return an object representing this challenge
    return update_data_object(o)
}

// Complete x different parkruns (20 and 100 are standard)
function challenge_tourist(data, params) {

    var o = create_data_object(params, "runner")

    distinct_parkruns_completed = {}

    $.each(data.parkrun_results, function(index, parkrun_event) {
      if (!(parkrun_event.name in distinct_parkruns_completed)) {
        o.subparts_completed_count += 1
        // Add it in for the next complete subpart
        p = Object.create(parkrun_event)
        p.subpart = o.subparts_completed_count
        p.name = p.eventlink
        p.info = p.datelink
        o.subparts_detail.push(p)

        // Add to the events done list, so that we can map them
        if (!(parkrun_event.name in o.completed_qualifying_events)) {
          o.completed_qualifying_events[parkrun_event.name] = get_parkrun_event_details(data, parkrun_event.name)
        }

        distinct_parkruns_completed[parkrun_event.name] = true
      }
    });

    var distinctParkrunsCompleteCount = Object.keys(distinct_parkruns_completed).length

    var badgesAwarded = []

    var gotAllBadges = true

    // Iterate through each stage, and see if we can award any badges for full or partial completion
    $.each(params.data.stages, function(index, stage){
      if (Array.isArray(stage.count)) {
        // This is a badge where you can get incremental completion
        var currentBadge = undefined
        $.each(stage.count, function(countIndex, countInfo){
          // If we have crossed the threshold for this partial badge, add the details.
          // This assumes that they are ordered by increasing value.

          // Define this badge once so we can award it, or add it to a row
          thisBadge = {
            "name": countInfo.name,
            "badge_icon": countInfo.badge_icon
          }
          if (distinctParkrunsCompleteCount >= countInfo.count) {
            console.log("Awarding the badge for "+countInfo.name)
            // Set the subpart detail to include the badge was awarded at this point
            o.subparts_detail[countInfo.count-1]["badge"] = thisBadge
            // Note this this badge was awarded
            currentBadge = thisBadge
          } else {
            console.log("Failed to get the badge for "+countInfo.name + " needed "+countInfo.count+", got "+distinctParkrunsCompleteCount)
            gotAllBadges = false
            // Add an empty subpart line so that people can see the badges they can still get
            o.subparts_detail.push({
              "subpart": countInfo.count,
              "badge": thisBadge
            })
          }
        })
        // Find the last badge we matched, and add that to the list of ones added by this challenge.
        if (currentBadge !== undefined) {
          badgesAwarded.push(currentBadge)
        }
      } else {
        currentBadge = {
          "name": stage.name,
          "badge_icon": stage.badge_icon
        }
        // This badge has a single target to hit, see if we have done so.
        if (distinctParkrunsCompleteCount >= stage.count) {
          console.log("Awarding the badge for "+stage.name)
          badgesAwarded.push(currentBadge)
          // Set the subpart detail to include the badge was awarded at this point
          o.subparts_detail[stage.count-1]["badge"] = currentBadge
        } else {
          console.log("Failed to get the badge for "+stage.name + " needed "+stage.count+", got "+distinctParkrunsCompleteCount)
          gotAllBadges = false
          // Add an empty subpart line so that people can see the badges they can still get
          o.subparts_detail.push({
            "subpart": stage.count,
            "badge": currentBadge
          })
        }
      }
    })

    o.badgesAwarded = badgesAwarded

    if (gotAllBadges) {
      o.complete = true
    }

    console.log(o)

    // Return an object representing this challenge
    return update_data_object(o)
}

// Just return true for now
// Return true if the athlete id for this page match what is stored in the user data
function is_our_page(data) {
  return has_user_data_athlete_id(data) && has_this_athlete_id(data) && get_user_data_athlete_id(data) == get_this_athlete_id(data)
}

function has_user_data(data) {
  return data.user_data !== undefined
}

function get_user_data(data) {
  return data.user_data
}

function has_user_data_athlete_id(data) {
  return has_it = false
  if (has_user_data(data)) {
    if (get_user_data(data).athlete_number !== undefined) {
      has_it = true
    }
  }
  return has_it
}

function get_user_data_athlete_id(data) {
  return get_user_data(data).athlete_number
}

function has_this_athlete_id(data) {
  return data.athlete_id !== undefined
}

function get_this_athlete_id(data) {
  return data.athlete_id
}

// Return true if there is valid geo data available
function has_geo_data(data) {
  geo_data = get_geo_data(data)
  return geo_data !== undefined
}

function get_geo_data(data) {
  return data.geo_data
}

// Return true if there is a home parkrun set
function has_home_parkrun(data) {
  home_parkrun = get_home_parkrun(data)
  return home_parkrun !== undefined
}

function get_home_parkrun(data) {
  if (data.user_data !== undefined) {
    return data.user_data.home_parkrun_info
  }
  return undefined
}

function has_lat_lon(details) {
  return details.lat !== undefined && details.lon !== undefined
}

function challenge_stopwatch_bingo(data, params) {

  var parkrun_results = data.parkrun_results

    var o = create_data_object(params, "runner")

    // Add all the subparts to the list
    for (i=0; i<60; i++) {
        number_string = i.toString()
        if (i < 10) {
            number_string = "0"+number_string
        }
        o.subparts.push(number_string)
        o.subparts_detail[number_string] = null
    }

    parkrun_results.forEach(function (parkrun_event) {
        // Take the last 2 characters of the time
        seconds = parkrun_event.time.substr(parkrun_event.time.length - 2)
        // Convert them to a number to get the index in our array
        subparts_detail_index = parseInt(seconds)
        if (o.subparts_detail[subparts_detail_index] == null) {
            o.subparts_detail[subparts_detail_index] = Object.create(parkrun_event)
            o.subparts_detail[subparts_detail_index].subpart = seconds
            o.subparts_detail[subparts_detail_index].name = parkrun_event.eventlink
            o.subparts_detail[subparts_detail_index].info = parkrun_event.time
            o.subparts_completed_count += 1

            if (!(parkrun_event.name in o.completed_qualifying_events)) {
              o.completed_qualifying_events[parkrun_event.name] = get_parkrun_event_details(data, parkrun_event.name)
            }

            if (o.subparts.length == o.subparts_completed_count) {
                o.complete = true
                o.completed_on = parkrun_event.date
            }
        }

    });

    // Add in all the missing ones
    for (i=0; i< o.subparts_detail.length; i++) {
        if (o.subparts_detail[i] == null) {
            o.subparts_detail[i] = {
                "subpart": o.subparts[i],
                "info": "-"
            }
        }
    }

    // Return an object representing this challenge
    return update_data_object(o)
}

// Complete 100 or 200 parkruns at the same venue
function challenge_single_parkrun_count(data, params) {

  var parkrun_results = data.parkrun_results
  var stages = params.stages

  var o = create_data_object(params, "runner")
  o.subparts = ["1"]
  o.summary_text = "0"

  var badgesAwarded = []

  parkruns_completed = {}
  max_count = 0
  max_parkrun = null

  parkrun_results.forEach(function (parkrun_event) {
    if (!(parkrun_event.name in parkruns_completed)) {
      parkruns_completed[parkrun_event.name] = {
        "name": parkrun_event.eventlink,
        "count": 0,
        "completed": false,
        "completed_at": null
      }
    }
    parkruns_completed[parkrun_event.name].count += 1
  })

  // Now we have an object showing how many times each
  // parkrun has been completed

  var subBadgesAvailable = []

  $.each(stages, function(index, tonMilestone) {
    subBadgesAvailable.push({
      "awarded": false
    })
  })
console.log("parkruns completed: " + parkruns_completed)
  // Now look at which completed parkruns have reached
  // the 'ton' milestones
  Object.keys(parkruns_completed).sort().forEach(function (name) {
    var currentBadge = undefined
    $.each(stages, function(index, tonMilestone) {
      if (parkruns_completed[name].count >= tonMilestone.count) {
        currentBadge = {
          "index": index,
          "name": tonMilestone.name,
          "count": tonMilestone.count,
          "badge_icon": tonMilestone.badge_icon
        }
      }
    })
      if (currentBadge !== undefined) {
        // Award a badge for this parkrun event
        o.subparts_detail.push({
          "name": name,
          "date": name,
          "info": parkruns_completed[name].count,
          "subpart": currentBadge.name+" ("+currentBadge.count+"+)",
          "badge": currentBadge
        })
        // Ensure that we add the badge at the top
        subBadgesAvailable[currentBadge.index].awarded = true
      }
    })

    // Change the summary to indicate number of times completed
    if (o.subparts_detail.length > 0) {
      o.summary_text = "x"+o.subparts_detail.length
    }

    // Award the badges to be displayed at the top
    $.each(subBadgesAvailable, function(index, subBadge) {
      if (subBadge.awarded == true) {
        badgesAwarded.push({
          "name": stages[index].name,
          "badge_icon": stages[index].badge_icon
        })
      }
    })

    o.badgesAwarded = badgesAwarded

    // Display the badges above what the parkrunner has, so they can see
    // what is still to come. i.e. if they have nothing, show all badges,
    // if they have 100, show 200, if  they already have 200
    // they then don't need hints and that'll do :)

    // Find the highest ones they have.
    var maxBadgeAwarded = -1
    $.each(subBadgesAvailable, function(index, subBadge) {
      if (subBadge.awarded) {
        maxBadgeAwarded = index
      }
    })
    console.log("parkrunner has achieved max ton level of " + maxBadgeAwarded)

/* 
    // Identify which parkrun event is most attended 
    // so that we can print progress towards the badge
    // if haven't already got one
    if (parkruns_completed[parkrun_event.name].count > max_count) {
      max_parkrun = Object.create(parkruns_completed[parkrun_event.name])
      max_count = parkruns_completed[parkrun_event.name].count
  }
 */


    // Add the badge for any higher badges than the ones they have
    $.each(stages, function(index, tonMilestone) {
      if (index > maxBadgeAwarded) {
        o.subparts_detail.push({
          // "subpart": count+"+",
          "badge": {
            "name": tonMilestone.name,
            "badge_icon": tonMilestone.badge_icon
          },
          "subpart": tonMilestone.name+" ("+tonMilestone.count+"+)",
          "name": "-"
        })
      }
    })

    // If they have been awarded the maximum badge, then give them a tick
    if (maxBadgeAwarded == stages.length-1) {
      o.complete = true
    }

    // Return an object representing this challenge
    return update_data_object(o)
  }


function challenge_on_dates(data, params) {
  var parkrun_results = data.parkrun_results
  var o = create_data_object(params, "runner")

  // This challenge looks to see that parkruns have been done on specific dates,
  // therefore we are passed in a set of days/months to match. It's not fair to
  // pass in a specific year as well, as no-one can work towards that, so we only
  // allow month & day combinations. E.g. for Christmas, or to run in every month
  // of the year, or perhaps even every date of the year, or Feb 29th or something -
  // all of these should work
  var challenge_dates = params.data // dates should be an array

  // For each part in the dates to match, make an empty array of matching
  // parkrun events.
  o.subparts = []
  if (challenge_dates !== undefined) {
    $.each(challenge_dates, function (index, this_challenge_date) {
      o.subparts[index] = []
    })
    if (challenge_dates.length > 1) {
      // If there is more than one subpart, then create the parts to show in the
      // ui
      $.each(challenge_dates, function (index, this_challenge_date) {

        subpart_name = this_challenge_date.month+"/"+this_challenge_date.day
        if (this_challenge_date.month !== undefined && this_challenge_date.day === undefined) {
          subpart_name = 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_')[this_challenge_date.month]
        } else if (this_challenge_date.month === undefined && this_challenge_date.day !== undefined) {
          subpart_name = this_challenge_date.day+"st/nd/rd/th"
        }

        o.subparts_detail[index] = {
            "subpart": subpart_name
        }

      })
    }
  }

  o.summary_text = "0"

  // We might be able to put these on a map, but not right now
  o.has_map = false

  parkrun_results.forEach(function (parkrun_event) {

    if (challenge_dates !== undefined) {
      $.each(challenge_dates, function (index, this_challenge_date) {
        // Default to not matching
        var applicable_month = false
        var applicable_day = false

        // Check if the month matches (getUTCMonth() - 0-11)
        if (this_challenge_date.month !== undefined ) {
          if (this_challenge_date.month == parkrun_event.date_obj.getUTCMonth()) {
            // console.log("Event matches the month for : " + JSON.stringify(this_challenge_date))
            applicable_month = true
          }
        } else {
          // There is no month to match, so it's a wildcard and always matches
          applicable_month = true
        }

        // Check if the day of the month matches (getUTCDate() - 1-31)
        if (this_challenge_date.day !== undefined ) {
          if (this_challenge_date.day == parkrun_event.date_obj.getUTCDate()) {
            // console.log("Event matches the day for : " + JSON.stringify(this_challenge_date))
            applicable_day = true
          }
        } else {
          // There is no day to match, so it's a wildcard and always matches
          applicable_day = true
        }

        if (applicable_day && applicable_month) {
          //console.log("Event matches both day & month for : " + JSON.stringify(this_challenge_date) + " - " + JSON.stringify(parkrun_event))
          // Append this completed parkrun to the correct subpart list
          o.subparts[index].push(parkrun_event)
        }

      })
    }

  })

  // Work out how many times we have completed the challenge by looking at
  // how many events have been added for each subpart
  var completion_count = undefined;
  console.log(o.subparts)
  o.subparts.forEach(function(events_for_this_date) {
    if (completion_count === undefined) {
      completion_count = events_for_this_date.length
    } else {
      completion_count = Math.min(completion_count, events_for_this_date.length)
    }
  })

  if (completion_count > 0) {
    o.complete = true
  }

  console.log("This challenge has been completed x" + completion_count)
  o.subparts_completed_count = completion_count

  // If there is only one date, we can reasonably list the date that the parkrunner
  // achieved this challenge. If it is a string of dates, it's nearly impossible
  // to do that in a sensible manner
  if (o.subparts.length == 1) {
    o.subparts[0].forEach(function(parkrun_event) {
      o.subparts_detail.push({
          "name": parkrun_event.eventlink,
          "date": parkrun_event.datelink,
          "info": parkrun_event.datelink,
          "subpart": o.subparts_detail.length + 1
      })
    })
  } else {
    // If there is more than one date, then lets list them all
    $.each(challenge_dates, function(index, matching_date) {

      if (o.subparts[index].length > 0) {
        o.subparts_detail[index].name = "x"+o.subparts[index].length
        o.subparts_detail[index].date = o.subparts[index][0].datelink
        o.subparts_detail[index].info = o.subparts[index][0].datelink
      }
    })
  }
  // If there are no subparts listed, make it a dash
  if (o.subparts_detail.length == 0) {
      o.subparts_detail.push({
          "subpart": o.subparts_detail.length + 1,
          "info": "-"
      })
  }

  // Change the summary to indicate number of times completed
  if (o.subparts_completed_count > 0) {
      o.summary_text = "x"+o.subparts_completed_count
  }

  // Return an object representing this challenge
  return update_data_object(o)

}

function challenge_nyd_double(data, params) {

  var parkrun_results = data.parkrun_results
    var o = create_data_object(params, "runner")
    o.subparts = ["1"]
    o.summary_text = "0"

    o.has_map = true
    if (has_home_parkrun(data) && is_our_page(data)) {
      o.home_parkrun = get_home_parkrun(data)
    }

    var previous_parkrun = null

    parkrun_results.forEach(function (parkrun_event) {
        // Take the first 6 characters of the date to get the '01/01/' part
        day_month = parkrun_event.date.substr(0, 6)

        if (previous_parkrun != null && day_month == "01/01/" && parkrun_event.date == previous_parkrun.date) {

            o.subparts_detail.push({
                "name": parkrun_event.eventlink+" and "+previous_parkrun.eventlink,
                "date": parkrun_event.datelink,
                "info": parkrun_event.datelink,
                "subpart": o.subparts_detail.length + 1
            })

            // Add to the events done list, so that we can map them
            if (!(parkrun_event.name in o.completed_qualifying_events)) {
              o.completed_qualifying_events[parkrun_event.name] = get_parkrun_event_details(data, parkrun_event.name)
            }
            if (!(previous_parkrun.name in o.completed_qualifying_events)) {
              o.completed_qualifying_events[previous_parkrun.name] = get_parkrun_event_details(data, previous_parkrun.name)
            }

            o.subparts_completed_count += 1
            // Mark it complete the first time it occurs
            if (!o.complete) {
                o.complete = true
                o.completed_on = parkrun_event.date
            }

        }

        previous_parkrun = parkrun_event

    });

    if (o.subparts_detail.length == 0) {
        o.subparts_detail.push({
            "subpart": o.subparts_detail.length + 1,
            "info": "-"
        })
    }

    // Change the summary to indicate number of times completed
    if (o.subparts_completed_count > 0) {
        o.summary_text = "x"+o.subparts_completed_count
    }

    // Return an object representing this challenge
    return update_data_object(o)
}

function challenge_groundhog_day(data, params) {

  var parkrun_results = data.parkrun_results
    var o = create_data_object(params, "runner")
    o.subparts = ["1"]
    o.summary_text = "0"
    o.has_map = true
    if (has_home_parkrun(data) && is_our_page(data)) {
      o.home_parkrun = get_home_parkrun(data)
    }

    var previous_parkrun = null

    parkrun_results.forEach(function (parkrun_event) {

        if (previous_parkrun != null && parkrun_event.time == previous_parkrun.time && parkrun_event.name == previous_parkrun.name) {

            o.subparts_detail.push({
                "name": parkrun_event.eventlink,
                "date": previous_parkrun.date+" and "+parkrun_event.date,
                "info": parkrun_event.time+" on "+previous_parkrun.datelink+" and "+parkrun_event.datelink,
                "subpart": o.subparts_detail.length + 1
            })

            // Add to the events done list, so that we can map them
            if (!(parkrun_event.name in o.completed_qualifying_events)) {
              o.completed_qualifying_events[parkrun_event.name] = get_parkrun_event_details(data, parkrun_event.name)
            }

            o.subparts_completed_count += 1
            // Mark it complete the first time it occurs
            if (!o.complete) {
                o.complete = true
                o.completed_on = parkrun_event.date
            }

        }

        previous_parkrun = parkrun_event

    });

    if (o.subparts_detail.length == 0) {
        o.subparts_detail.push({
            "subpart": o.subparts_detail.length + 1,
            "info": "-"
        })
    }

    // Change the summary to indicate number of times completed
    if (o.subparts_completed_count > 0) {
        o.summary_text = "x"+o.subparts_completed_count
    }

    // Return an object representing this challenge
    return update_data_object(o)
}

function difference(setA, setB) {
  var _difference = new Set(setA);
  for (var elem of setB) {
    _difference.delete(elem);
  }
  return _difference;
}

function challenge_regular_running(data, params) {

  var parkrun_results = data.parkrun_results
  var o = create_data_object(params, "runner")
  o.subparts = ["1"]
  o.summary_text = "0"
  o.has_map = true
  if (has_home_parkrun(data) && is_our_page(data)) {
    o.home_parkrun = get_home_parkrun(data)
  }

  // Event centric list - we want a data structure which contains each event
  // and list of dates on which that event has been run.
  var eventcentric = {}
  parkrun_results.forEach(function (parkrun_event) {

    if( !Object.keys(eventcentric).includes(parkrun_event.name)) {
      eventcentric[parkrun_event.name] = {}
      eventcentric[parkrun_event.name]['name'] = parkrun_event.name
      eventcentric[parkrun_event.name]['dates'] = []
      eventcentric[parkrun_event.name]['dates'].push(parkrun_event.date)
    } else {
      eventcentric[parkrun_event.name]['dates'].push(parkrun_event.date)
    }
  });

  var d = new Date();
  var thisyear = d.getFullYear()

  // Test whether we're regularly running there
  Object.keys(eventcentric).forEach(function(event) {

    eventcentric[event]['years'] = new Set();
    eventcentric[event]['earliestyear'] = undefined;

    // For each date on which we've run this parkrun...
    eventcentric[event]['dates'].forEach(function(d) {

      // Extract year and add to Set
      year = d.substr(6, 4)
      eventcentric[event]['years'].add(year)

      if(year < eventcentric[event]['earliestyear'] || eventcentric[event]['earliestyear'] === undefined) {
        eventcentric[event]['earliestyear'] = year
      }
    });

    // Have they run EVERY year between earliestyear and THIS year?
    // Build a list of years to test against...
    possibleyears = new Set();
    for(i = eventcentric[event]['earliestyear']; i <= thisyear; i++) {
      possibleyears.add(i.toString())
    }

    // Flag whether they've run at every year since they first ran the event...
    // (is there a difference between possible years and actual years ran?)
    if(difference(possibleyears, eventcentric[event]['years']).size == 0 &&
        thisyear != eventcentric[event]['earliestyear']) {
      eventcentric[event]['regular'] = 1
    } else {
      eventcentric[event]['regular'] = 0
    }
  });

  // Push out summary
  Object.keys(eventcentric).forEach(function(event) {

    parkrun_event = eventcentric[event]

    if (parkrun_event['regular'] == 1) {
      o.subparts_detail.push({
        "name": parkrun_event.name,
        "date": '',
        "info": parkrun_event['earliestyear'] + ' - ' + thisyear,
        "subpart": o.subparts_detail.length + 1
      })

      // Add to the events done list, so that we can map them
      if (!(parkrun_event.name in o.completed_qualifying_events)) {
        o.completed_qualifying_events[parkrun_event.name] = get_parkrun_event_details(data, parkrun_event.name)
      }

      o.subparts_completed_count += 1
      o.complete = true
    }

  });

  if (o.subparts_detail.length == 0) {
    o.subparts_detail.push({
      "subpart": o.subparts_detail.length + 1,
      "info": "-"
    })
  }

  // Change the summary to indicate number of times completed
  if (o.subparts_completed_count > 0) {
    o.summary_text = "x"+o.subparts_completed_count
  }

  // Return an object representing this challenge
  return update_data_object(o)
}

function challenge_obsessive(data, params) {

    var parkrun_results = data.parkrun_results
    var stages = params.stages

    var o = create_data_object(params, "runner")
    o.subparts = ["1"]
    o.summary_text = "0"

    var badgesAwarded = []

    by_year = {}

    parkrun_results.forEach(function (parkrun_event) {
        // Take the first 6 characters of the date to get the '01/01/' part
        year = parkrun_event.date.substr(6, 4)

        if (!(year in by_year)) {
            by_year[year] = []
        }

        by_year[year].push(parkrun_event)

    })

    // We now have an object showing us how many parkruns were attended in each year.
    // Until such a time as volunteering can be allocated in this way, this just means 
    // running and getting a result.

    console.log(by_year)

    var subBadgesAvailable = []

    $.each(stages, function(index, obsessiveMilestone) {
      subBadgesAvailable.push({
        "awarded": false
      })
    })

    // Now lets look at each year for which we have data, and see if the different milestones 
    // have been reached.
    Object.keys(by_year).sort().forEach(function (year) {
      var currentBadge = undefined
      $.each(stages, function(index, obsessiveMilestone) {
        if (by_year[year].length >= obsessiveMilestone.count) {
          currentBadge = {
            "index": index,
            "name": obsessiveMilestone.name,
            "count": obsessiveMilestone.count,
            "badge_icon": obsessiveMilestone.badge_icon
          }
        }
      })
      if (currentBadge !== undefined) {
        // Award a badge for this year
        o.subparts_detail.push({
          "name": year,
          "date": year,
          "info": by_year[year].length,
          "subpart": currentBadge.name+" ("+currentBadge.count+"+)",
          "badge": currentBadge
        })
        // Ensure that we add the badge at the top
        subBadgesAvailable[currentBadge.index].awarded = true
      }

    })

    // Change the summary to indicate number of times completed
    if (o.subparts_detail.length > 0) {
      o.summary_text = "x"+o.subparts_detail.length
    }

    // Award the badges to be displayed at the top
    $.each(subBadgesAvailable, function(index, subBadge) {
      if (subBadge.awarded == true) {
        badgesAwarded.push({
          "name": stages[index].name,
          "badge_icon": stages[index].badge_icon
        })
      }
    })

    o.badgesAwarded = badgesAwarded


    // Display the badges above what the parkrunner has, so they can see
    // what is still to come. i.e. if they have nothing, show all 3 badges,
    // if they have bronze, show silver+gold, have silver, show gold, if 
    // they already have gold, they then don't need hints and that'll do :)

    // Find the highest ones they have.
    var maxBadgeAwarded = -1
    $.each(subBadgesAvailable, function(index, subBadge) {
      if (subBadge.awarded) {
        maxBadgeAwarded = index
      }
    })
    console.log("parkrunner has achieved max obsessive level of " + maxBadgeAwarded)

    // Add the badge for any higher badges than the ones they have
    $.each(stages, function(index, obsessiveMilestone) {
      if (index > maxBadgeAwarded) {
        o.subparts_detail.push({
          // "subpart": count+"+",
          "badge": {
            "name": obsessiveMilestone.name,
            "badge_icon": obsessiveMilestone.badge_icon
          },
          "subpart": obsessiveMilestone.name+" ("+obsessiveMilestone.count+"+)",
          "name": "-"
        })
      }
    })

    // If they have been awarded the maximum badge, then give them a tick
    if (maxBadgeAwarded == stages.length-1) {
      o.complete = true
    }

    // Return an object representing this challenge
    return update_data_object(o)
}

function unroll_regions(sorted_region_heirachy) {

  summary = {}
  iterate_unroll_regions(summary, sorted_region_heirachy, 0)
  return summary

}

function iterate_unroll_regions(summary, region, parent_id) {

  summary[region.id] = {
    name: region.name,
    parent_id: parent_id,
    complete: region.complete,
    completed_on: region.completed_on,
    child_regions: region.child_regions.map(r => r.id),
    child_events: region.child_events,
    child_events_completed: region.child_events_completed,
    // Recursive data, for all child regions and their children, downloads
    recursive_child_events_completed: region.child_events_completed_count,
    recursive_child_events_count: region.child_events_total,
  }
  region.child_regions.forEach(function(sub_region) {
    iterate_unroll_regions(summary, sub_region, region.id)
  })

}

function calculateCountryCompletionInfo(data) {

  var countryCompletionInfo = {}
  // Pre-populate information about each country
  $.each(data.geo_data.data.countries, function(countryName, countryInfo) {
    // Find out how many of the events are active
    var countryActiveEvents = 0
    countryInfo['child_event_names'].forEach(function(eventName){
      var eventInfo = data.geo_data.data.events[eventName]
      if (eventInfo.status == 'Live' || eventInfo.status == 'unknown') {
        countryActiveEvents += 1
      }
    })
    // Initialise an information object for the country
    countryCompletionInfo[countryName] = {
      "name": countryName,
      "id": countryInfo["id"],
      "childEventsCount": countryInfo['child_event_names'].length,
      "childActiveEventsCount": countryActiveEvents,
      "childEventsCompleted": [],
      "childEventsCompletedCount": 0,
      "firstRanOn": undefined,
      "visited": false
    }
  })
  // Iterate through each event that has been completed by athlete

  var groupedResults = group_results_by_event(data.parkrun_results)
  console.log(groupedResults)

  $.each(groupedResults, function(eventName, eventAttendance){
    // Find extra information from the events data
    if (eventName in data.geo_data.data.events) {
      var eventInfo = data.geo_data.data.events[eventName]
      // console.log(eventInfo)
      var countryEntry = countryCompletionInfo[eventInfo.country_name]
      countryEntry.childEventsCompleted.push(eventName)
      countryEntry.childEventsCompletedCount += 1

      // Mark this country as visited
      countryEntry.visited = true

      // Stash the date we first ran at this event
      var eventFirstRunDate = eventAttendance[0].date_obj

      // Find out if this was the ealiest we ever ran in this country
      if (countryEntry.firstRanOn === undefined || eventFirstRunDate < countryEntry.firstRanOn) {
        countryEntry.firstRanOn = eventFirstRunDate
      }

    } else {
      // We don't know where this event was, perhaps it has closed
    }
  })

  return countryCompletionInfo
}

function calculate_child_regions(regions, events_completed_map, parent_region) {

    var region_info = {
        'name': parent_region,
        "id": regions[parent_region]["id"],
        "complete": false,
        "completed_on": null,
        "child_regions": [],
        "child_events": [],
        "child_events_total": 0,
        "child_events_completed": {},
        "child_events_completed_count": 0,
        "first_ran_on": null
    }

    // child_region_info = []
    if (regions[parent_region].child_region_names.length == 0) {
        // No sub regions
    } else {
        regions[parent_region].child_region_names.sort().forEach(function (region_name) {
            child_region_parkrun_info = calculate_child_regions(regions, events_completed_map, region_name)
            region_info["child_regions"].push(child_region_parkrun_info)
            region_info["child_events_total"] += child_region_parkrun_info["child_events_total"]
            region_info["child_events_completed_count"] += child_region_parkrun_info["child_events_completed_count"]
            if (region_info.first_ran_on == null ||
                (child_region_parkrun_info.first_ran_on != null &&
                    child_region_parkrun_info.first_ran_on < region_info.first_ran_on)) {
                region_info.first_ran_on = child_region_parkrun_info.first_ran_on
            }
            // child_region_info.push(child_region_parkrun_info)
        })
    }

    region_info["child_events_total"] += regions[parent_region].child_event_names.length
    if (regions[parent_region].child_event_names.length > 0) {
        regions[parent_region].child_event_names.sort().forEach(function (event_name) {
            // Work out if we have completed this parkrun
            // Lets just say yes for now
            region_info["child_events"].push(event_name)
            if (event_name in events_completed_map) {
                region_info["child_events_completed_count"] += 1
                // Add the first completed run at this event to our list
                region_info["child_events_completed"][event_name] = events_completed_map[event_name][0]
                first_run_date = events_completed_map[event_name][0].date_obj
                if (region_info.first_ran_on == null ||
                    first_run_date < region_info.first_ran_on) {
                    region_info.first_ran_on = first_run_date
                }
            }
        })
    }

    // Now that we have processed everything below, see if we have completed
    // this region
    region_info["complete"] = (region_info["child_events_completed_count"] == region_info["child_events_total"])

    return region_info

}

function generate_regionnaire_detail_info(region, depth) {
    var details = []

    prefix = Array(depth).join("- ")

    if (region["child_events_total"] > 0) {
        details.push({
                "subpart": prefix + region["name"],
                "info": region["child_events_completed_count"] + "/" + region["child_events_total"],
                "complete": region["child_events_completed_count"] == region["child_events_total"],
                "completed_on": null
        })
    }

    region["child_regions"].forEach(function(child_region) {
        sub_region_info = generate_regionnaire_detail_info(child_region, depth+1);
        sub_region_info.forEach(function (array_entry) {
            details.push(array_entry)
        })
    })

    return details
}

function challenge_by_region(data, params) {

  var parkrun_results = data.parkrun_results
  var geo_data = data.geo_data

    var o = create_data_object(params, "runner")
    o.summary_text = ""

    regions = geo_data.data.regions
    // Sort all of the completed parkruns by event so that we can pick out which
    // has been run, and when that was
    o.events_completed_map = group_results_by_event(parkrun_results)
    sorted_region_heirachy = calculate_child_regions(regions, o.events_completed_map, "World")
    // console.log(sorted_region_heirachy)

    o.regions = sorted_region_heirachy

    o.unrolled_regions = unroll_regions(sorted_region_heirachy)

    o.subparts_detail = generate_regionnaire_detail_info(sorted_region_heirachy, 0)

    // Work out of any regions have been completed
    o.subparts_detail.forEach(function (detail) {
        if (detail.complete) {
            o.subparts_completed_count += 1
            o.complete = true
        }
    })

    if (o.subparts_completed_count > 0) {
        o.summary_text = "x"+o.subparts_completed_count
    }

    // Return an object representing this challenge
    return update_data_object(o)
}
