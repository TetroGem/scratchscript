# ScratchScript
*A text-based programming language that compiles to Scratch 3.0 Projects (.sb3)*
This project is still heavily unfinished and WIP. New updates must be installed manually by redownloading this repository and following all the setup instructions below again. Please report any bugs you find in the Issues tab!
<br><br>
*Created by [@TetroGem](https://github.com/TetroGem)*
<br><br>

## How to program in ScratchScript (.scs)
### Types
- Sprite: A sprite in Scratch
- Costume: A costume for a Sprite
- Float: Any positive or negative number
- PositiveFloat: Any positive number
- String: Any text (written in quotes)
- Angle: Any number between -360 and 360 (inclusive) (in degrees)

### Scopes
- Global: New Config or Event scopes can be created
- Config: Code that will setup the properties of a new Sprite
- Event: Code that will perform Actions on a Sprite

### Creating and Using Scopes
- In Global Scope:
  - Sprite \[spriteName\] { \[\[Config Scope\]\] }
  - [spriteName].[event] { \[\[Event Scope\]\] }
- In Config Scope:
  - Costume \[costumeName\] (String relativePath);
- In Event Scope:
  - @[action] [arguments?];

### Sprites
The first costume inside of a Sprite's Config Scope will be the default costume for that Sprite.
Properties of sprites can be accessed by using the sprite's name followed by a period then the property name (e.g. `player.onFlag`) in the Global Scope. Inside of a Sprite's Scope (either the Config or Event Scope), the sprite's name is omitted and replaced by an @ sign (e.g. `@initialize`).

### Event Properties
- onFlag: Runs when the green flag is clicked
- onClick: Runs when the sprite is clicked
- onKeyPress : (Space | UpArrow | DownArrow | LeftArrow | RIghtArrow): Runs when the specified key is pressed

### Action Properties
- walk (Float steps): Move the Sprite in the direction it is pointing
- wait (PositiveFloat duration): Waits for the specified duration (in seconds) before performing its next Action
- turn (Float degrees): Turns the Sprite the specified number of degrees
- say (String message) (Float secs): Makes the Sprite say the specified message for the specified duration (in seconds)
- goto (Float x) (Float y): Teleports the Sprite to the specified coordinates
- point (Angle degrees): Points the Sprite in the specified direction
- initialize: Sets the Sprite back to its default state
- costume: Changes the Sprite's costume to the specified Costume

## Costume Properties
Costumes defined in the Config Scope of a Sprite are stored as properties of that Sprite. They can then be accessed like any other property of a Sprite when needed. (e.g. Declaring a costume 'main' with `Costume main "image.png";` then switching to it with `@costume @main;`)

### Example
```ruby
Sprite player {
    Costume main "./player.png";
    Costume talking "./playerTalking.png";
}

player.onFlag {
    @initialize;
}

player.onClick {
    @costume @talking;
    @say "Hello!" 2;
    @costume @main;
}

player.onKeyPress : UpArrow {
    @point 0;
    @walk 30;
}

player.onKeyPress : DownArrow {
    @point 180;
    @walk 30;
}

player.onKeyPress : LeftArrow {
    @point 90;
    @walk -30;
}

player.onKeyPress : RightArrow {
    @point 90;
    @walk 30;
}
```

## How to compile ScratchScript (.scs) to a Scratch 3.0 Project (.sb3)
### Setup ScratchScript Compiler
- Clone/download this repository to your computer
- Install [Node.js](https://nodejs.org/en/) (It is recommended to install the LTS version)
- Open a terminal/command prompt
- Change the directory to where you cloned/downloaded this repository (e.g. `cd C:\Users\username\Downloads\ScratchScript-master`)
- Install the dependencies this project by running `npm install`

### Compile your ScratchScript code
- Navigate to the folder containing your ScratchScript code/files (e.g. `cd C:\Documents\MyProject`)
- Run the following command: `npx tsx [compilerDir] [inputFile] [outputFile?]` (e.g. `npx tsx C:\Downloads\ScratchScript-master\src\index.ts main.scs main.sb3`)
- You should then see the compiled .sb3 file in your folder!
- The `[outputFile]` is optional. If not specified, it will save the .sb3 file in the same directory as the .scs file with the same name. (e.g. `main.scs` will be compiled to `main.sb3`)
  - You could also only specify a path, in which case the .sb3 file will be saved there instead of in the same folder as the .scs file. (e.g. `npx tsx C:\Downloads\ScratchScript-master\src\index.ts main.scs C:\Documents\CompiledProjects`) It will still have the same name as the .scs file. (e.g. `main.scs` will be compiled to `C:\Documents\CompiledProjects\main.sb3`)
  - You could also specify a path and a new filename for the .sb3 file. (e.g. `npx tsx C:\Downloads\ScratchScript-master\src\index.ts main.scs C:\Documents\CompiledProjects\myProject.sb3`)

### Loading a Scratch 3.0 Project (.sb3) into Scratch
- Create a New Project in Scratch
- Click the 'File' tab at the top of the code editor
- Click 'Load from your computer'
- Open the .sb3 file you just compiled
- Your project should now be loaded into Scratch!

You've reached the bottom, and I'm sorry I made you read this much about Scratch.
