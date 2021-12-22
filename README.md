# GenAlt

## Issue Log: 
1) Rate Limiting and 429 errors 
   1) like on a google images page
   2) Nobody's going to read 50 images / one second, so we can definitely rate limit to a ratio of like 25 images : 1 second
      1) and then have the computer stop in the for-loop for (cur_ratio - actual_ratio) seconds before iterating with the new promises. 
2) Caption Maybe Bad (average is just OK).
   1) I mean .. we'll see 

3) Maybe drop a popup button, to stop the generation of alt-text
   1) okay so this actually requires CAREFUL software engineering design 
4) Captions on Facebook, etc. that need to be replaced. 
   1) detect really bad, useless captions. 
5) Actually check with a screen reader whether or not it's making a difference. 