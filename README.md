#README - 

The README file must give an overview of what you are handing in: which parts are your code, which parts are libraries, and so on. The README must contain URLs to your project websites. The README must also explain any non-obvious features of your interface.

Heatmap - 
JQuery was used to help add more responsiveness to the visualization such as helping to resize the view when the window size is changed.
The view can be seen at http://stephaniemertz.com/IV/heatmap.html or aaosgood3.github.io/heatmap/heatmap.html
Styling (legend, transition between datasets, etc) was heavily borrowed from Tom May's example. 

Features:
Tooltip - the styled tooltip shows precisely how many applications there are on average for each time to give a more granular view of 
the data encoded by the darkness of the tile.

Toggle data buttons - the buttons can toggle between different datasets to allow the user to get a deeper view into how summer vs semester
plays into the data.

The transition between the different datasets is animated so a user can keep their eyes on one day/time or area and watch how the color lightens/darkens
It is harder to compare when the screen goes white in between views. 


Map - 
The visualization for the world and the US are at different stages of development, given some of the conclusions from the world map prompted the rapid development of the US map.
The world map uses JQuery to resize by resetting the animation to scale each of the applicant markers appropriately. 

Features:
Both maps animate using a slider that scales from the first application we received on 4/24/2016 to the last one the day before the event. As a result of our 1:1 meeting, I
switched the solid red circles I had been using previously for the hollow rings and animated them so the user can more clearly see volume shade of red, rather than a solid red
circle blocking the view. Additioanlly, the hollow inner circle helped to show when people from the same school applied, given our location tracing only took into account the 
applicant's declared school.

Tooltip - hovering over any circle will show a tooltip containing the school they applied from and when. This helped us greatly in cities like Chicago, where the academic density lead to a large nubmer of applicants coming from different schools in a small area.

'Nearest Campaign Indiciator' - this feature was started and nearly completed (but not, alas) on the US graph. This is effectively a stationary tooltip that will tell the user which of the marketing efforts was the most recent for the current value of the slider date. 

URLs:
Heatmap: http://stephaniemertz.com/IV/heatmap.html
World Geographic Map: https://aaosgood3.github.io/infovisfinal/world
US Geographic Map: https://aaosgood3.github.io/infovisfinal/us/
GitHub: https://github.com/aaosgood3/aaosgood3.github.io/tree/master/infovisfinal




