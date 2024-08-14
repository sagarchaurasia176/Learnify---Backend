const { default: mongoose } = require("mongoose");
const { instance } = require("../config/RazorPay");
// const { courseEnrollmentEmail } = require("../Mail/CourseEnrollment");
const Courses = require("../model/Courses");
const Users = require("../model/User");
const mailSender = require("../utils/MailSender");

// create the payment and instance it
exports.paymentGateway = async (req, res) => {
  try {
    const { course_id } = req.body;
    const userId = req.user.id;
    // validation
    if (!course_id) {
      return res.status(404).json({
        success: false,
        message: "id not matched",
      });
    }
    //validation in course id
    let course;
    try {
      course = await Courses.findById(course_id);
      if (!course) {
        return res.status(404).json({
          success: false,
          message: "id not matched",
        });
      }
      //user already pay for the same course
      const uuid = new mongoose.Types.ObjectId(userId);
      //if alraedy pay then
      if (course.studentEnrolled.includes(uuid)) {
        return res.status(404).json({
          success: false,
          message: "student existed ! ",
        });
      }
    } catch (er) {
      return res.status(404).json({
        success: false,
        message: "id not matched",
      });
    }

    // order create
    const amount = course.price;
    const currency = "INR";

    const options = {
      amount: amount * 100,
      currency: currency,
      receipt: Math.random(Date.now()).toString(),
      notes: {
        course_id: course_id,
        userId,
      },
    };

    // create an instance here for payment purpose
    try {
      const paymentGatewayInstance = instance.orders.create(options);
      console.log(paymentGatewayInstance + " response from gateway");
      return res.status(200).json({
        success: true,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        thumbnail: course.thumbnail,
        orderId: (await paymentGatewayInstance).id,
        currency: (await paymentGatewayInstance).currency,
        amount: (await paymentGatewayInstance).amount,
      });
    } catch (er) {
      return res.status(404).json({
        success: false,
        message: "could not initiate the order",
      });
    }

    //response
  } catch (er) {
    return res.status(404).json({
      success: false,
      message: "error in payment gateway controller!",
    });
  }
};

// verify the signature in payment Gateway
exports.paymentGatewayVerification = async (req, res) => {
  try {
    // web hooks
    const webHooks = "1234";
    const signature = req.headers["x-razorpay-signature"];
    const shasum = crypto.createHmac("sha256", webHooks);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");
    // let's compared signature and digest if both same then stop
    if (signature === digest) {
      console.log("payment is authorized");
      const { course_id, userId } = req.body.payload.entity.notes;
      try {
        // fullfil the actiosn
        const enrolledCourse = await Courses.findOneAndUpdate(
          { _id: course_id },
          { $push: { studentEnrolled: userId } },
          { new: true }
        );
        if (!enrolledCourse) {
          return res.status(505).json({
            success: false,
            message: "course not found!",
          });
        }

        // enrolled course
        console.log("enrolled course");
        // find the student and update
        const enrolled = await Users.findOneAndUpdate(
          { _id: userId },
          { $push: { courses: course_id } },
          { new: true }
        );
        const emailResponse = await mailSender(
          enrolled.email,
          " congratulation , you are onboarded into new learnify course"
        );
        return res.status(204).json({
          success: true,
          message: "email sent succesfully !",
        });
      } catch (er) {
        return res.status(505).json({
          success: false,
          message: "course not found!",
        });
        //   mail send
        //   main error
      }
    } else {
      return res.status(505).json({
        success: false,
        message: "payment is not authorized",
      });
    }
  } catch (er) {
    // some action performs
    return res.status(505).json({
      success: false,
      message: "error at payment Gateway!",
    });
  }
};
