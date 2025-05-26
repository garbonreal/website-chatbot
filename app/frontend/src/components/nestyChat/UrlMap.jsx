// useLoadUrlMap.ts
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { urlMapAtom } from "../../states";
import rawUrlMap from '../../assets/url_map.txt?raw';


let loaded = false;

export const useLoadUrlMap = () => {
  const setUrlMap = useSetRecoilState(urlMapAtom);

  useEffect(() => {
    if (loaded) return;

    const lines = rawUrlMap.split("\n");
    const map = {};

    for (const line of lines) {
      const [key, value] = line.trim().split(" ");
      if (key && value) map[key] = value;
    }
    
    setUrlMap(map);
    loaded = true;
  }, []);
};

export default useLoadUrlMap;