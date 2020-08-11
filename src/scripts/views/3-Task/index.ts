import ElementCleanerForFreelancer from "./_/ElementCleanerForFreelancer";
import FreelancerTool from "./_/FreelancerTool";
import responseSection from "./_/responseSection";
import taskSection from "./_/taskSection";

System.pageLoaded("Task inject OK!");

if (System.checkBrainlyP(102)) {
  if (System.checkUserP(1)) {
    taskSection();
  }

  if (System.checkUserP(2)) {
    responseSection();
  }

  if (System.checkUserP(35, true)) {
    ElementCleanerForFreelancer();
    // eslint-disable-next-line no-new
    new FreelancerTool();
  }
}
