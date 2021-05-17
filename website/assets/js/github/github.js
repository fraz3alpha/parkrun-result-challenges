
function create_issue_table(div_id, issues) {
  // Find the appropriate div in the DOM
  issues_table_div = $("div[id='"+div_id+"']").first()
  // Create a table object to construct
  issues_table = $("<table/>")

  // Iterate over each issue returned, and create a row for it
  $.each(issues, function (index, github_issue) {
    console.log(github_issue)
    console.log(github_issue.reactions)
    issue_row = $('<tr/>')
    issue_row.append($('<td/>').append($('<a/>').attr('href', github_issue.html_url).html(github_issue.title)))
    issues_table.append(issue_row)
  })

  // Create some data there
  issues_table_div.empty()
  issues_table_div.append(issues_table)
}


$.ajax({
  // Fetch the open, unimplemented challenge ideas
  url: "https://api.github.com/repos/fraz3alpha/running-challenges/issues?labels=new-challenge&state=open",
}).then((result) => {
  // Populate a table with these issues
  create_issue_table("github-open-challenge-ideas-table", result)
  // Fetch the implemented challenges
  return $.ajax({
    url: "https://api.github.com/repos/fraz3alpha/running-challenges/issues?labels=new-challenge,added&state=closed"
  })
}).then((result) => {
  // Populate a table with these issues
  create_issue_table("github-implemented-challenge-ideas-table", result)
})
