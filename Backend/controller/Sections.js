const Sections = require("../model/Section");
const SubSections = require("../model/SubSection");
const CourseSections = require("../model/Courses");
// create course sections here first
exports.createSection = async (req, res) => {
  try {
    //data fetch
    const { SectionName, CourseId } = req.body;
    if (!SectionName || !CourseId) {
      return res.status(404).json({
        success: false,
        message: "Field is empty kindly update it!",
      });
    }
    //start to create the section
    const newSection = await Sections.create({ SectionName });
    const updateSection = await CourseSections.findByIDAndUpdate(
      CourseId,
      {
        $push: {
          courseContent: newSection_id,
        },
      },
      { new: true }
    );
    //update the course secton objectId
    // return the response
    return res.status(200).json({
      success: true,
      message: "secton Create succefully!",
    });
  } catch (er) {
    return res.status(404).json({
      success: false,
      message: "section controller not updated",
      error: er.message,
    });
  }
};
// update Sections
exports.updateSection = async (req, res) => {
  try {
    const { SectionName, SectionId } = req.body;
    if (!SectionName || !SectionId) {
      // return the response
      return res.status(400).json({
        success: false,
        message: "enter the UpdatesectionName fields!",
      });
    }
    // updated data passed here
    const sectionUpdated = await Sections.findByIdAndUpdate(
      SectionId,
      { SectionName },
      { new: true }
    );

    // return resp
    // return the response
    return res.status(200).json({
      success: true,
      message: "section updated succefully !",
    });
  } catch (er) {
    return res.status(404).json({
      success: false,
      message: "update section not updated",
      error: er.message,
    });
  }
};

// delete sections
exports.deleteSections = async (req, res) => {
  try {
    const { SectionId } = req.params;
    await Sections.findByIdAndDelete(SectionId);
    return res.status(200).json({
      success: true,
      message: "section delete succefully",
    });
  } catch (er) {
    return res.status(404).json({
      success: false,
      message: "Delete section not updated",
      error: er.message,
    });
  }
};
