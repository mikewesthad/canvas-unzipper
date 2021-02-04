# Canvas Unzipper

When you download a zip of student work submissions for an assignment on Canvas, it gives you a zip that contains student work as a bunch of loose files. I have my students turn in a zip and a screenshot for most projects, so I get something like:

```
submissions.zip
├── smithbob_340934_208490284_BobsWork.zip
├── smithbob_340934_208490284_BobsScreenshot.png
├── wellslane_334244_394803489_MyAssignment.zip
├── wellslane_334244_394803489_MyAssignment.png
├── wellslane_334244_394803489_MyAssignment1.png
├── wellslane_334244_394803489_MyAssignment2.png
└── ...
```

This tool unzips the submissions and places each student's work into a directory. If a student submitted a zip, it will also unzip that students work. The previous example would be turned into:

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

Make sure you have [node & npm](https://nodejs.org/en/) installed, and then run:

```
npx install -g canvas-unzippper
```

If you've got a zip download from Canvas, you can run:

```
canvas-unzip path/to/submissions.zip path/to/desired/output
```

Help info:

```
canvas-unzip [options] <pathToStudentWorkZip> <pathToOutputUnzippedWork>

canvas-unzip

Arguments:
  pathToStudentWorkZip      Path to a downloaded submissions zip from Canvas
  pathToOutputUnzippedWork  Path to output the unzipped and organized student work

Options:
  -V, --version             output the version number
  -v, --verbose             Output extra verbose information while unzipping student work.
  -h, --help                display help for command
```

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
- A student has a "_" in their name.

## To Dos

- Update the tool to report some stats on what was extracted.