# Technical test

## Instructions

You can find the instructions on this [repo github](https://github.com/selego/technical-test-4)

## Setup api

- cd api
- Run `npm i`
- Run `cp .env.example .env` and fill the .env file with your own values
- Run `npm run dev`

## Setup app

- cd app
- Run `npm i`
- Run `npm run dev`

## Responses

**1- What bugs did you find ? How did you solve these and why ?**

**bug 1**: [commit](https://github.com/loicginoux/node-react-test-project/commit/8d71611d85864a17ed3f1a3f46e50e6237ab2938) Creating a user from the user list page should create a user with a name.
The attribute was `username` and should be `name`. `username` is the name of the attribute used by passeportjs. The model user has no such attribute but rather use `name`.

User's name should be filled because it is unique and necessary for logging in. Also it was showing an empty user card in the user list page.

**bug 2**: [commit](https://github.com/loicginoux/node-react-test-project/commit/6c92334237df589c8a58495e8dd7f4e041d43d4b) Displaying a project should render the page.
page does not show and it's a key feature. chaging the method call to MongoDB to allow to return one project only (with `findOne`) instead of an array of projects with `find`.

**bug 3**: [commit](https://github.com/loicginoux/node-react-test-project/commit/b5307d20719e9be63ccf1df527bc781f9afd57f9)  Updating a user should trigger a user update to API.
the html event was not the correct one fired in order to trigger the API call.

**bug  4**: [commit](https://github.com/loicginoux/node-react-test-project/commit/a6bb0d35193258ff442613b0dacc772d5be87423) Clicking "signup" on login page should only redirect without triggerring a signin api call and displaying signin errors for few milliseconds.
Formik warned to add a type="button"on the signup button, so I did.

**bug 5**: [commit](https://github.com/loicginoux/node-react-test-project/commit/686a0cbfc2f447299e216996d602dcb903d4b5b2) Sending an invalid password should render a 400 error so that the front end can display an error message. It was sedning a 200 http code so the user had no error feedback.
Adding a 400 error and displaying field specific errors should be a better user experience ([commit](https://github.com/loicginoux/node-react-test-project/commit/2a7f75be647e8658f1a1af8f06df8dc6d3d5642c))

**bug 6**: [commit](https://github.com/loicginoux/node-react-test-project/commit/3613078c2a13d2605a545775c20acd6f0375eb0f) This is a big one ! Removing MongoDB credentials from repository.

- I removed the .env from git via gitignore
- I added a `.env.example` that should be copied during project initialisation to a `.env` file.
- I updated the readme to take into account this extra step
- I cleaned the config.js file to remove the mongoDB credentials.

This is a big security vulnerability and in real case we should think that this DB is compromised. It would be better to swap it with a new one and we also should clean the git history following a tutorial like this one to be sure to not have these credentials anywhere. https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository

**bug 7**: [commit](https://github.com/loicginoux/node-react-test-project/commit/5bdbbcb4a0bc6281b4ec64dd551f2f4667be5e70) There is a unique index on the name for the Project model. This is bad because if 2 users from different organisations create a project with the same name, the second one will have an error "project already taken" but will not see it in his projects list (because project list is scoped to the current user organisation)
We should change it to a compound unique index based on name+organisation.
In real life we should also resync indexes to remove the "project name index" but because the DB is shared with other candidates I won't do it here.

**bug 8**: [commit](https://github.com/loicginoux/node-react-test-project/commit/219d548bbca16e7a7fd9608c3591563e87819cf1) Password input is of type text when creating a user from the admin. It should be of type password to avoid showing the password on screen.

**bug 9**: [commit](https://github.com/loicginoux/node-react-test-project/commit/a1d84ca0453683bd72fc16596c5e51feaba1ebd1) Searching user should not break if a user has no name.
we should handle the case when user has no name when filtering the users list.

**bug 11**: [commit](https://github.com/loicginoux/node-react-test-project/commit/1343986afc60bb264700ea09baad94d70ed060bc) Remove React warning: `value` prop on `select` should not be null. Consider using an empty string to clear the component or `undefined` for uncontrolled components. The SelectMonth component was instantiated with a value undefined.

**bug 12**: [commit](https://github.com/loicginoux/node-react-test-project/commit/7b78d2a6101312558c085249d691dbedf647dd9d) Remove React warning: Encountered two children with the same key, `undefined`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version.

**bug 13**: [commit](https://github.com/loicginoux/node-react-test-project/commit/72095e36b6144df1ea4b57af84283de984832d2a) Fix filtering activites by user. It was not working because the naming of the user field was not consistent between the front and the back. I changed the front to match the back. It should be more clear and consistent now that we use the userId everywhere.

**bug 14**: [commit](https://github.com/loicginoux/node-react-test-project/commit/a957178c537183a4b28b29464ea8ec0ae9089b91) Fix filtering activites by project. The selectbox should render the project we just selected instead of staying on "all projects", and after selecting a given project, we should be able to select again “all projects”. It was not working because the naming of the project field was not consistent, sometimes using the project name, and sometimes the project id.

**bug 15**: [commit](https://github.com/loicginoux/node-react-test-project/commit/1bba49cf18e54c6ea780c3a193511572698f8d1a) Creating a project should display the project in the list. It was not working because the project list was not refreshed and page needed reloading. The Create component should call a callback prop to refresh the list.



**2 - Which feature did you develop and why ?**

[commit](https://github.com/loicginoux/node-react-test-project/commit/e9847b15e4346579eb1f310a48dc3ba30aaca6ba)

To be fair, the the best feature I should have developed would have been to write tests for existing features. But I did not have time to set them up and write all of them. Also to be noted that, fixing bugs should have been associated with tests to avoid regression.

So I decided to have a quick win, I moved the edit user page and added a user view page that display montly activity for this user.

![Screenshot 2024-03-11 at 10 38 52](https://github.com/loicginoux/node-react-test-project/assets/824936/e9e4ab9c-0dc0-4162-b439-0069b15c4397)

I wanted to use the data costPerDay and sellPerDay attributes of a user that is not used anywhere in the app. I thought it would be interesting to display them in a page.
We can quickly check the current worload by displaying statistics for current month. This page allow to respond to the following questions:

- How many hours this user worked this month ?
- How many hours this user cost this month ?
- How many hours this user billed this month ?
- On what projects did the user worked ?

Some of these information are already present in the activity index page but it lacks the cost and sell information and it is only available for the current user.

**3 - Do you have any feedback about the code / architecture of the project and what was the difficulty you encountered while doing it ?**

**The good:**

- code well enough structured for the codebase size. Structure could be improved for larger project but It can be read and understood easily. We find what we are looking for in order to understand the code.
- use of passeport for authentication
- use of React hooks
- use of Tailwind

**The bad:**

- From a UI point of view, it was not clear at first sight that every data showing was scoped to the current user's organisation. It could be highlighted by showing the organisation name on the UI header for example.
- A NoSQL database. I understand this is a quick win for a test project but I would not start a real project with a NoSQL DB. I have to admit I actually never used one in production environment and I am not yet convinced by its advantages over an SQL DB. Personnaly, I would go with Postgresql.
- No permissions and restrictions on API level. This might not be important for this exercice but there is nothing, in the API, stopping me from changing my organisation name and crawling projects and activities from other organisations (given that I manage to guess other users organisations)

**The ugly:**

- No tests... That may be why there are so many bugs ;)
- sensitive credentials (MONGO_URL) are stored in github and shared to all. This could be the intention for the purpose of the exercice and for making the test simpler, but this is still considered a bad practice.
