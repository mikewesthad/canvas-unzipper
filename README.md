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