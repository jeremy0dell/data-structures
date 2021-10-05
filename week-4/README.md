# Database Schema

I chose this database schema because it seemed like it would be decently simple to query and the model makes sense to me. I don't know very much about the intimate details of what being in AA is like, but if it's anything like an urgent doctor appointment visit, I feel like I'd want to first know *when* the soonest meeting is happening and then sort out *where* I should go.

Because of this I make my most prominent attribute in my hierarchy be Time, and have an attached attribute that points to a Group ID. This also makes sense to me because I haven't yet seen a Weekday/Start Time/End Time combination that's happening with the same Group. In other words, Groups have a one-to-many relationship with Times in this model.

I decide to have Groups have a Location ID attribute because even though I haven't seen it yet in this data, I suspect that a single location could house multiple Groups. Currently in the Locations table I have only one attribute, *Address*, but I might split this up into *Street Address*, *Zipcode*, *City*, etc, if the need arises for any reason.
