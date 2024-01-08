import { Asset } from "expo-asset";

const dictionaryAssets = {
  "base.dat.gz": Asset.fromModule(
    require("../../assets/kuromoji-dict/base.dat.gz")
  ),
  "check.dat.gz": Asset.fromModule(
    require("../../assets/kuromoji-dict/check.dat.gz")
  ),
  "tid.dat.gz": Asset.fromModule(
    require("../../assets/kuromoji-dict/tid.dat.gz")
  ),
  "tid_pos.dat.gz": Asset.fromModule(
    require("../../assets/kuromoji-dict/tid_pos.dat.gz")
  ),
  "tid_map.dat.gz": Asset.fromModule(
    require("../../assets/kuromoji-dict/tid_map.dat.gz")
  ),
  "cc.dat.gz": Asset.fromModule(
    require("../../assets/kuromoji-dict/cc.dat.gz")
  ),
  "unk.dat.gz": Asset.fromModule(
    require("../../assets/kuromoji-dict/unk.dat.gz")
  ),
  "unk_pos.dat.gz": Asset.fromModule(
    require("../../assets/kuromoji-dict/unk_pos.dat.gz")
  ),
  "unk_map.dat.gz": Asset.fromModule(
    require("../../assets/kuromoji-dict/unk_map.dat.gz")
  ),
  "unk_char.dat.gz": Asset.fromModule(
    require("../../assets/kuromoji-dict/unk_char.dat.gz")
  ),
  "unk_compat.dat.gz": Asset.fromModule(
    require("../../assets/kuromoji-dict/unk_compat.dat.gz")
  ),
  "unk_invoke.dat.gz": Asset.fromModule(
    require("../../assets/kuromoji-dict/unk_invoke.dat.gz")
  ),
};

export default dictionaryAssets;
