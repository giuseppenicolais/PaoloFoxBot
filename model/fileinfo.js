
var FileInfo = function(){

	var _fileInfoModel,
		_fileInfoSchema;

	var _findById = (telegram_file_id, onSuccess, onFail) => {
		//TODO
		return false;
	}

	var _findAllByTime = (insertion_date, onSuccess, onFail) => {
		//TODO
		return false;
	}

	var _upsert = (fileInfo, onSuccess, onFail) => {
		//TODO
		return false;
	}

	return {
		findAllByTime : _findAllByTime,
		findById: _findById ,
		upsert : _upsert,
		model: _fileInfoModel,
		schema: _fileInfoSchema
	}
}();

module.exports = FileInfo;