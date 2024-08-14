const SubSection = require("../model/SubSection");
const section = require("../model/Section");
const { MediaUploaderToCloud } = require("../utils/MediaUploderToCloud");
const Section = require("../model/Section");

// subSections handler
exports.CreateSubSection = async (req, res) => {
  try {
    const { sectionId, title, timeDuration, description } = req.body;
    // extract video using the cloudinary
    const video = req.files.videoFile;
    // validation check
    if (!sectionId || !title || !timeDuration || !description) {
      return res.status(404).json({
        success: false,
        message: "empty field in subsection part",
        error: er.message,
      });
    }
    // video upload to the cloud parts
    const videoUploadDetailsToCloudinary = await MediaUploaderToCloud(
      video,
      process.env.FOLDER
    );
    const subSectionDetails = await SubSection.create({
      title: title,
      timeDuration: timeDuration,
      description: description,
      videoUrl: videoUploadDetailsToCloudinary.secure_url,
    });

    // update the section here
    const uploadSection = await Section.findByIdAndUpdate(
      { _id: sectionId },
      {
        $push: {
          SubSections: subSectionDetails._id,
        },
      },
      { new: true }
    );

    // return the response
    return res.status(200).json({
      success: true,
      message: "Sub section Successfully  done!",
    });
  } catch (er) {
    return res.status(404).json({
      success: false,
      message: "subSection not created err in controller!",
      error: er.message,
    });
  }
};

exports.updateSubSection = async (req, res) => {
  try {
    const { sectionId, title, description } = req.body;
    const subSection = await SubSection.findById(sectionId);

    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      });
    }

    if (title !== undefined) {
      subSection.title = title;
    }

    if (description !== undefined) {
      subSection.description = description;
    }
    if (req.files && req.files.video !== undefined) {
      const video = req.files.video;
      const uploadDetails = await uploadImageToCloudinary(
        video,
        process.env.FOLDER_NAME
      );
      subSection.videoUrl = uploadDetails.secure_url;
      subSection.timeDuration = `${uploadDetails.duration}`;
    }

    await subSection.save();

    return res.json({
      success: true,
      message: "Section updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the section",
    });
  }
};

exports.deleteSubSection = async (req, res) => {
  try {
    const { subSectionId, sectionId } = req.body;
    await Section.findByIdAndUpdate(
      { _id: sectionId },
      {
        $pull: {
          subSection: subSectionId,
        },
      }
    );
    const subSection = await SubSection.findByIdAndDelete({
      _id: subSectionId,
    });

    if (!subSection) {
      return res
        .status(404)
        .json({ success: false, message: "SubSection not found" });
    }

    return res.json({
      success: true,
      message: "SubSection deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the SubSection",
    });
  }
};
