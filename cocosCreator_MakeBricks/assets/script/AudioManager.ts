import { AudioClip, AudioSource, assert, warn, clamp01, resources, assetManager } from "cc";
export class AudioManager {

    private static _instance: AudioManager;
    private static _audioSource?: AudioSource;

    static get instance() {
        if (this._instance) {
            return this._instance;
        }

        this._instance = new AudioManager();
        return this._instance;
    }

    /**管理器初始化*/
    init(audioSource: AudioSource) {
        AudioManager._audioSource = audioSource;
        console.log("AudioManager", AudioManager._audioSource)
    }

    /**
   * 播放音乐
   * @param {Boolean} loop 是否循环播放
   */
    playMusic(loop: boolean) {
        const audioSource = AudioManager._audioSource!;
        assert(audioSource, 'AudioManager not inited!');

        audioSource.loop = loop;
        if (!audioSource.playing) {
            audioSource.play();
        }
    }

    /**
    * 播放音效
    * @param {String} name 音效名称
    * @param {Number} volumeScale 播放音量倍数
    */
    playSound(name: string, volumeScale: number = 1) {
        const audioSource = AudioManager._audioSource;
        assert(audioSource, 'AudioManager not inited!');
        // const res = "sounds/" + name;
        // resources.load(res, AudioClip, (err, audioClip) => {
        //     audioSource.playOneShot(audioClip, volumeScale);
        //     // 注意：第二个参数 “volumeScale” 是指播放音量的倍数，最终播放的音量为 “audioSource.volume * volumeScale”
        // });
        assetManager.loadBundle('audios', (err, bundle) => {
            console.log("audios", bundle)
            // bundle.load('xxx');
            bundle.load(name, AudioClip, (err, audioClip) => {
                audioSource.playOneShot(audioClip, volumeScale);
                // 注意：第二个参数 “volumeScale” 是指播放音量的倍数，最终播放的音量为 “audioSource.volume * volumeScale”
            });
        });
    }
    // 设置音乐音量
    setMusicVolume(flag: number) {
        const audioSource = AudioManager._audioSource!;
        assert(audioSource, 'AudioManager not inited!');

        flag = clamp01(flag);
        audioSource.volume = flag;
    }

}