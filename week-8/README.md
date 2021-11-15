# Week 8
### AA Meeting Finder
![image](https://user-images.githubusercontent.com/20379698/141144353-75bd4f1f-3e29-4efc-bde4-2524770bd54d.png)

1. This visualization will be highly interactive. It will have a zoomable/pannable map from Google, Mapbox, or OpenStreetMap, as well as a comprehensive filter with a date picker, and multiple dropdowns to determine what kind of meeting should be searched for.
2. The data will be mapped to an actual map, showing the locations of found AA meetings, as well as a list view which will show the same data, but with more details (like meeting type).
3. The data will need to be structured to allow for easy searching by date/time. I will probably have each possible time/place combination be it's own table entry because of the relatively small dataset.
4. The default view will be a map on the left with no filters added, and an empty list on the right.
5. I'm assuming the user knows how to use typical map searching and filtering methods, like they would with Google Maps.

### My Fitness Diary
![image](https://user-images.githubusercontent.com/20379698/141144423-93425f7d-ba0a-41f4-b797-894cc04a0cbd.png)

1. This visualization will be somewhat interactive. It will have 5 available filters: 1. Clicking "Total Statistics", which shows a view of the amount of time I've spent exercising, as well as total volume lifted, 2. Clicking "Search Results" will show the results based on the filters to the left, 3. "Date" will display a date picker, 4. "Type" will display a dropdown menu with lifting/cardio, 5. "Exercises" will display a dropdown with all available exercises.
2. This data will only be mapped to a scrollable div that shows text information. The total exercises will also be listed in a text dropdown.
3. The data will be structured with the ability to sort by date. The primary key will probably be either total volume lifted or time spent exercising. These might be combined into one property in the DB table.
4. The default view will show the total exercise statistics on the right, and a blank date picker on the left.
5. I'm assuming the user is me. I'm not worried about anyone else trying to use this, because they shouldn't be interested in my exercise information. The user should be able to use typical form controls.

### Bedroom Window Temperature
![image](https://user-images.githubusercontent.com/20379698/141146434-aba3ba32-9edf-4425-8aec-5259c768f6d8.png)

1. This visualization will be somewhat interactive. It will have a date range picker near the top to allow the user to filter temperatures by date. The line chart will also have a hoverable tooltip that allows the user to view the temperature at an exact time.
2. The data will be mapped to a line chart.
3. The data will be sortable by datetime, and have one property (temperature).
4. The default view will be yesterday's temperatures. This will be displayed below the date range picker.
5. I'm assuming the user is me again. This is my bedroom temperature data, so I'm not worried about other people being interested in this data. The user should be able to use a date picker and be able to read a line chart.
