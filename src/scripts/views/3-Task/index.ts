/* eslint-disable no-new */
import ElementCleanerForFreelancer from "./_/ElementCleanerForFreelancer";
import FreelancerTool from "./_/FreelancerTool";
import JumpToBottomButton from "./_/JumpToBottomButton";
import QuestionPage from "./_/QuestionPage/QuestionPage";

System.pageLoaded("Question page OK!");

new JumpToBottomButton();

if (System.checkBrainlyP(102) && System.checkUserP([1, 2])) {
  new QuestionPage();
}

if (System.checkUserP(35, true)) {
  ElementCleanerForFreelancer();
  new FreelancerTool();
}
