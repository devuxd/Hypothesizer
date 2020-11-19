
## Hypothesizer

Getting the correct hypothesis about what might cause a defect is a critical factor for debugging success. Hypothesizer is a new form of debugging tool that explicitly offers developers support for sharing, finding, and testing debugging hypotheses.  
Read more here: 

[1] [Using Hypotheses as a Debugging Aid](https://arxiv.org/pdf/2005.13652.pdf)<br/>
[2] [Helping Developers Find and Share DebuggingHypotheses]()
### `Contributing to Hypothesizer`
* Clone this repo `` git clone https://github.com/devuxd/Hypothesizer.git  `` .
* Move to the project folder ``cd Hypothesizer`` .
* Install dependences ``npm install`` .
* Run auto build script `` npm run watch:d1 `` . you could change ``d1`` to any other defect avaliable in the project by changing the number ``1`` to the defect number you want.
* Load the tool inside google chrome extension by going to  settings > more tools > extensions > load unpacked. Selected the build folder.
* Open up the chrome devtools by going to settings > more tools > developers tools.
* You should see a tab in the devtools with the title `Hypothesizer`.
* When you make any changes, click on the refresh button on the top screen inside `Hypothesizer` to have your latest change applied.




