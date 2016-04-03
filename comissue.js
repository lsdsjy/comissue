/*
* Project: Comissue
* Author: lsdsjy
*/

var ci_re;

var ci_act = {
    DEFAULT: 0,
    FETCH_ISSUES: 1,
    POST_ISSUE: 2,
    FETCH_COMMENTS: 3,
    POST_COMMENTS: 4
};

var ci_state = ci_act.DEFAULT;

function format(message) {
    if (!message) {
        return null;
    }

    var ss = message.split(/\{\d+?\}/);
    for (var i = 0; i < ss.length; i++) {
        if (!arguments[i + 1]) {
            break;
        }
        ss[i] += arguments[i + 1];
    }

    return ss.join("");
}

function sendRequest(url, method, rbody) {
    ci_re = new XMLHttpRequest();
    if (ci_re) {
        ci_re.onreadystatechange = transact;
        ci_re.open(method, url, true);
        ci_re.send(rbody);
    } else {
        alert("No XMLHttpRequest support!");
    }
}

function transact() {
    if (ci_re.readyState == 4) {
        switch (ci_re.status) {
            case 200:
                document.write(ci_re.responseText);
                break;
            case 201:
                alert(ci_re.responseText);
                break;
            case 400:
                break;
            default:
                alert("Error occured!");
        }
        ci_state = ci_act.DEFAULT;
    }
}

function fetchIssues(access_token) {
    url = "https://api.github.com/repos/lsdsjy/comissue/issues?access_token=" + access_token;
    sendRequest(url, "GET", null);
    ci_state = ci_act.FETCH_ISSUES;
}

function fetchComments(access_token, issue_no) {
    url = format("https://api.github.com/repos/lsdsjy/comissue/issues/{0}/comments?access_token={1}", issue_no, access_token);
    sendRequest(url, "GET", null);
    ci_state = ci_act.FETCH_COMMENTS;
}

function postIssue(access_token, title, body) {
    url = "https://api.github.com/repos/lsdsjy/comissue/issues?access_token=" + access_token;
    var data = {
        "title": title,
        "body": body
    };
    sendRequest(url, "POST", JSON.stringify(data));
    ci_state = ci_act.POST_ISSUE;
}
