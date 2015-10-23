
Project Post Mortem

Here we enumerate what we consider to be the top right and wrong decisions made during the development of QueueHero.

The Good things:

1. Before writing the first line of code, we had our app thoroughly planned and structured across the full tech stack. We were a team of four engineers working together for the first time, so we considered very important to go all the way to maintain each of us engaged with the design and the plan. When we all had agreed on the user experience blueprints, we went backwards defining the data objects, urls, naming conventions and the interfaces we would use to serve those screens.

2. Our Scrum Master proposed a very detailed Git workflow and contribution style that served us very well during the project. The workflow behaved as expected and was more of a source of tranquility rather than a source of pains. We did not use ‘git rebase’ in for this project.

3. We planned our file structure very carefully, with a good separation of concerns. This led to highly modularized code that could be maintained by many developers with great stability and little or no merge conflicts. In the front end we had a folder of each angular component. Within it you would find separate files for the model, the view and the controller respectively. We kept two separate master folders for shared and unshared components and a separate file for each Angular factor.

Key learnings:

1. We think we could have been benefited substantially from establishing a convention for giving classes and ids to html elements. This would have help us not only to maintain a better naming consistency and clarity but would have allow us to achieve -we believe- a better looking MVP much sooner, since more than one engineer would have been able to contribute at the same time to the styling of the app. We believe the MVP stage would have been more stimulating and enjoyable if we would have had some default styling even from the "hello world" stage.

2. We miscalculated the effort necessary to gracefully integrate some of the originally planned APIS that none of us had used before. This came and bite us by forcing to postpone the payment integration feature and the mobile Ionic deployment. We think it would have been better to first launch a payment integrated web version and then focus on other features and mobile optimizations.

3. All the client ajax calls were originally served from one Angular factory, consequently this file grew bigger than desired, affecting the flexibility to have several people making changes to this file without having to prevent and resolve merge conflicts. We ended up refactoring and splitting that big file into the several models of each angular component.This was the
approach to take from the very beginning.
