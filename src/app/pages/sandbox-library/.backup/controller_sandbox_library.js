const { StatusCodes } = require("http-status-codes");
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");
const SandboxLibrary = require("../model/sandbox_library");

// POST /sandbox_library/create
exports.create = async (req, res) => {
  try {
    const { name, language, editor_mode, template_code, status } = req.body;
    if (!name) return res.send({ status: 400, msg: "Name is required" });
    if (!language) return res.send({ status: 400, msg: "Language is required" });

    const sandbox = new SandboxLibrary({
      name,
      language,
      editor_mode: editor_mode || "javascript",
      template_code: template_code || "",
      status: status || "active",
      created_by: req.user._id,
    });
    await sandbox.save();

    return res.send({ status: StatusCodes.OK, msg: "Sandbox created successfully", data: sandbox });
  } catch (error) {
    console.log("sandbox_library create error:", error);
    return res.send({ status: StatusCodes.INTERNAL_SERVER_ERROR, msg: "Something went wrong. Please try again later." });
  }
};

// POST /sandbox_library/get
exports.get = async (req, res) => {
  try {
    const { search, page = 1, limit = 20, status } = req.body;

    const query = {};
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { language: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [data, total] = await Promise.all([
      SandboxLibrary.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      SandboxLibrary.countDocuments(query),
    ]);

    return res.send({
      status: StatusCodes.OK,
      data,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    console.log("sandbox_library get error:", error);
    return res.send({ status: StatusCodes.INTERNAL_SERVER_ERROR, msg: "Something went wrong. Please try again later." });
  }
};

// POST /sandbox_library/get_by_id
exports.get_by_id = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.send({ status: 400, msg: "ID is required" });

    const sandbox = await SandboxLibrary.findById(id);
    if (!sandbox) return res.send({ status: 404, msg: "Sandbox not found" });

    return res.send({ status: StatusCodes.OK, data: sandbox });
  } catch (error) {
    console.log("sandbox_library get_by_id error:", error);
    return res.send({ status: StatusCodes.INTERNAL_SERVER_ERROR, msg: "Something went wrong. Please try again later." });
  }
};

// POST /sandbox_library/update
exports.update = async (req, res) => {
  try {
    const { id, name, language, editor_mode, template_code, status } = req.body;
    if (!id) return res.send({ status: 400, msg: "ID is required" });

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (language !== undefined) updateData.language = language;
    if (editor_mode !== undefined) updateData.editor_mode = editor_mode;
    if (template_code !== undefined) updateData.template_code = template_code;
    if (status !== undefined) updateData.status = status;

    const sandbox = await SandboxLibrary.findByIdAndUpdate(id, updateData, { new: true });
    if (!sandbox) return res.send({ status: 404, msg: "Sandbox not found" });

    return res.send({ status: StatusCodes.OK, msg: "Sandbox updated successfully", data: sandbox });
  } catch (error) {
    console.log("sandbox_library update error:", error);
    return res.send({ status: StatusCodes.INTERNAL_SERVER_ERROR, msg: "Something went wrong. Please try again later." });
  }
};

// POST /sandbox_library/delete
exports.delete = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.send({ status: 400, msg: "ID is required" });

    await SandboxLibrary.findByIdAndDelete(id);

    return res.send({ status: StatusCodes.OK, msg: "Sandbox deleted successfully" });
  } catch (error) {
    console.log("sandbox_library delete error:", error);
    return res.send({ status: StatusCodes.INTERNAL_SERVER_ERROR, msg: "Something went wrong. Please try again later." });
  }
};

// POST /sandbox_library/get_stats
exports.get_stats = async (req, res) => {
  try {
    const [total, active, inactive] = await Promise.all([
      SandboxLibrary.countDocuments({}),
      SandboxLibrary.countDocuments({ status: "active" }),
      SandboxLibrary.countDocuments({ status: "inactive" }),
    ]);

    return res.send({
      status: StatusCodes.OK,
      data: { total, active, inactive },
    });
  } catch (error) {
    console.log("sandbox_library get_stats error:", error);
    return res.send({ status: StatusCodes.INTERNAL_SERVER_ERROR, msg: "Something went wrong. Please try again later." });
  }
};

// POST /sandbox_library/execute
exports.execute = async (req, res) => {
  try {
    const { code, language } = req.body;
    if (!code) return res.send({ status: 400, msg: "Code is required" });
    if (!language) return res.send({ status: 400, msg: "Language is required" });

    const supported = {
      javascript: { ext: "js", cmd: "node" },
      python: { ext: "py", cmd: "python" },
      typescript: { ext: "ts", cmd: "npx ts-node" },
    };

    const lang = supported[language];
    if (!lang) {
      return res.send({ status: 400, msg: `Execution not supported for ${language}. Supported: JavaScript, Python, TypeScript.` });
    }

    const tmpDir = os.tmpdir();
    const fileName = `sandbox_${Date.now()}.${lang.ext}`;
    const filePath = path.join(tmpDir, fileName);

    fs.writeFileSync(filePath, code, "utf8");

    let output = "";
    try {
      output = execSync(`${lang.cmd} "${filePath}"`, {
        timeout: 10000,
        encoding: "utf8",
        maxBuffer: 1024 * 512,
      });
    } catch (execErr) {
      output = execErr.stderr || execErr.stdout || execErr.message;
    } finally {
      try { fs.unlinkSync(filePath); } catch (_) {}
    }

    return res.send({ status: StatusCodes.OK, data: { output: output || "Code executed successfully. (No output)" } });
  } catch (error) {
    console.log("sandbox_library execute error:", error);
    return res.send({ status: StatusCodes.INTERNAL_SERVER_ERROR, msg: "Something went wrong. Please try again later." });
  }
};
