# Individual Project Journal: s339541 Jon Kurmaku

## Activity Log
| Date | Activity Description | Effort (Hours) | Related Report Section |
| :--- | :--- | :--- | :--- |
| [2026-04-19](#log-2026-04-19) | Setup project skeleton and journal template| 0.5 | -- |
| [2026-04-21](#log-2026-04-21) | Overview and React Native metric analysis | 2 | Overview |
| [2026-05-14](#log-2026-05-14) | Overview, Code dependencies | 4 | Overview, SoftwareDesign |
| [2026-05-15](#log-2026-05-14) |  Code dependencies | 6 |  SoftwareDesign |


## Detailed Contributions
### <a id="log-2026-04-19"></a>[2026-04-19]
**Specific Contribution:** As a prequisite to the first meeting of the group, the project Github repository was set up, with the requirements (structure) as specified in the Project description file. To make sure the team follows the same journal format, I created a markdown snippet located in `/templates/journal-template.md`. Also to keep track of global tasks a `todo.md` TODO file was created in the root directory.

### <a id="log-2026-04-21"></a>[2026-04-21][Report Overview]
**Specific Contribution:** A primary draft of the Overview report has been created. I used the Github insight and analytic views to extract some data about the metric of React Native repository, and the metrics i could not find in Github i extracted manually using the Rust written tool `tokei` for file breakdown. The more descriptive parts of the Overview report were done in conjuction with the offical React Native documentation, Wikipedia and with external documentation such as "The Learning React Native" book by Bonnie Eisenman [https://www.oreilly.com/library/view/learning-react-native/9781491929049/ch01.html]. Also i fixed the template to enable the dates in the `Activity Log` to act as anchors for the `Detailed Contribution` and the root directory `README.MD` with the project structure. 

### <a id="log-2026-05-14"></a><a id="log-2026-05-15"></a>[2026-05-14][2026-05-15][Report Overview, SoftwareDesign]
**Specific Contribution:** Moved structure of package/react-native to Overview.md from SoftwareDesign.md, as that information is more coherent with the overview of the project rather than the design aspects. Created a `dump/analyze-dependencies.js` file in order to extract the dependencies metrics and data from `packages/react-native/*` and the output of this file is the `dump/DEPENDENCY_ANALYSIS.md`. Due to excessive amounts of information in the Analysis markdown i took the time to refine and process only the information needed from the markdown and to insert into the Software Design report. 

