# Canvas Unzipper

When you download a zip of student work for an assignment on Canvas, it gives you a zip with a structure that looks something like:

```
submissions/
├── smithbob_340934_208490284_BobsWork.zip
├── smithbob_340934_208490284_BobsScreenshot.png
├── wellslane_334244_394803489_MyAssignment.zip
├── wellslane_334244_394803489_MyAssignment.png
├── wellslane_334244_394803489_MyAssignment1.png
├── wellslane_334244_394803489_MyAssignment2.png
└── ...
```

This tool unzips that work and places each student's work into a directory like this:

```
output/
├── smithbob
│   ├── smithbob_340934_208490284_BobsWork
│   │   ├── file1.html
│   │   ├── file2.html
│   │   └── ...
│   └── smithbob_340934_208490284_BobsScreenshot.png
├── wellslane
│   ├── wellslane_334244_394803489_MyAssignment
│   │   ├── file1.cs
│   │   ├── file2.txt
│   │   └── ...
│   ├── wellslane_334244_394803489_MyAssignment.png
│   ├── wellslane_334244_394803489_MyAssignment1.png
│   └── wellslane_334244_394803489_MyAssignment2.png
└── ...
```

## Installation & Usage

TODO

## Important Notes

This tool looks at the files in the download and tries to identify students from the file names. In a zip download from canvas, the files are named like this:

```
wellslane_334244_394803489_MyAssignment2.png
```

Where the convention is:

```
[LastNameFirstName]_[SomeID]_[SomeOtherID]_[StudentOriginalFileName]
```

This tool simply splits the file on "_" and uses the first part as their name. This will likely not work correctly if:

- Two students have the same first name and last name.
- You add some extra random files to the zip folder.
- A student has a "_" in their name.

## To Dos

- Publish to NPM for easy global install as a CLI tool.
- Update the tool to accept a zip from canvas as the input.
- Update the tool to accept an output path as an option (vs unzipping in the current location).
- Update the tool to report some stats on what was extracted.