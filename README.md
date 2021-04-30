dev-docs
--------

Actual docs of this is now on our web-site. See whereby.dev/

Using
-----

There's still some code left that's useful to test and run. You should have local-stack (that has
been run once) in a sibling folder under the name `local-stack`.

Then you can run it like this:

   yarn
   yarn start

Then you can go to i.e.:

   https://ip-127-0-0-1.hereby.dev:8080/embed/
   https://ip-127-0-0-1.hereby.dev:8080/iframe/

If you're running local-stack, you probably want to test with a local room, this URL might be
helpful to you as a starting point:

   https://ip-127-0-0-1.hereby.dev:8080/embed/?room=https://ip-127-0-0-1.hereby.dev:4443/room%3Fembed=off

In fact you can even use production to test if you don't need any changes, just allow-list https://whereby.dev origin:

   https://whereby.dev/embed/?room=https://ip-127-0-0-1.hereby.dev:4443/room%3Fembed=off
