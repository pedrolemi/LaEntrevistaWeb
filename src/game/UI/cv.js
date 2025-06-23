import InteractiveContainer from "../../framework/UI/interactiveContainer.js";
import TextArea from "../../framework/UI/textArea.js";

export default class CV extends InteractiveContainer {
    constructor(scene) {
        super(scene);

        this.bgBlock = scene.add.rectangle(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT, 0x000, 0.5).setOrigin(0, 0);
        this.add(this.bgBlock);

        this.sheet = scene.add.image(this.CANVAS_WIDTH / 2, this.CANVAS_HEIGHT / 2, "cvSheet").setOrigin(0.5, 0.5);
        this.add(this.sheet);


        this.TITLES_TEXT_CONFIG = {
            fontFamily: "leagueSpartan-variable",
            fontSize: 23,
            fontStyle: "bold",
            color: "#000000",
            align: "center",
        }

        this.INFO_TEXT_CONFIG = {
            fontFamily: "leagueSpartan-variable",
            fontSize: 25,
            fontStyle: "normal",
            color: "#000000",
            align: "left",

        }

        this.BULLET_POINT_SPACING = 10;


        this.title = scene.add.text(this.CANVAS_WIDTH / 2, 35, this.translate("title"), this.TITLES_TEXT_CONFIG).setOrigin(0.5, 0.5);
        this.title.setFontSize(40);
        this.title.setFontStyle("normal");
        this.add(this.title);

        this.createDataSection();

        this.data = this.scene.add.text(this.CANVAS_WIDTH / 2, 420, this.translate("data"), this.TITLES_TEXT_CONFIG).setOrigin(0.5, 0.5);
        this.add(this.data);

        this.createAboutSection();


        this.calculateRectangleSize();
        this.setVisible(false);

        this.on("pointerdown", () => {
            this.activate(false);
        });
    }


    translate(section) {
        return this.scene.localizationManager.translate(section, "CVs").toUpperCase();
    }

    createAboutSection() {
        let PAGE_MARGIN = 37;
        let ABOUT_W = (this.sheet.displayWidth / 2) - PAGE_MARGIN * 2;
        let ABOUT_H = this.INFO_TEXT_CONFIG.fontSize * 1.5;

        let ABOUT_TITLES_CONFIG = { ...this.TITLES_TEXT_CONFIG };
        ABOUT_TITLES_CONFIG.align = "left";

        let ABOUT_TEXT_CONFIG = { ...this.INFO_TEXT_CONFIG };
        ABOUT_TEXT_CONFIG.fontSize = 20;

        let TOP_Y = 120;
        let TITLE_SPACING = 90;
        let x = this.sheet.x - this.sheet.displayWidth / 2 + PAGE_MARGIN * 1.5;
        let x2 = x + ABOUT_H;
        let y = TOP_Y;
        this.nameTitle = new TextArea(this.scene, x, y, ABOUT_W, ABOUT_H, this.translate("nameTitle"), ABOUT_TITLES_CONFIG).setOrigin(0, 0.5);
        this.nameTitle.adjustFontSize();

        this.name = new TextArea(this.scene, x2, y + ABOUT_H, ABOUT_W, ABOUT_H, this.translate("name"), ABOUT_TEXT_CONFIG).setOrigin(0, 0.5);
        this.name.adjustFontSize();


        y += TITLE_SPACING;
        this.civilStateTitle = new TextArea(this.scene, x, y, ABOUT_W, ABOUT_H, this.translate("civilStateTitle"), ABOUT_TITLES_CONFIG).setOrigin(0, 0.5);
        this.civilStateTitle.adjustFontSize();

        this.civilState = new TextArea(this.scene, x2, y + ABOUT_H, ABOUT_W, ABOUT_H, this.translate("civilState"), ABOUT_TEXT_CONFIG).setOrigin(0, 0.5);
        this.civilState.adjustFontSize();


        y += TITLE_SPACING;
        this.educationTitle = new TextArea(this.scene, x, y, ABOUT_W, ABOUT_H, this.translate("educationTitle"), ABOUT_TITLES_CONFIG).setOrigin(0, 0.5);
        this.educationTitle.adjustFontSize();

        this.education = new TextArea(this.scene, x2, y + ABOUT_H, ABOUT_W, ABOUT_H, this.translate("education"), ABOUT_TEXT_CONFIG).setOrigin(0, 0.5);
        this.education.adjustFontSize();


        this.add(this.nameTitle);
        this.add(this.name);
        this.add(this.civilStateTitle);
        this.add(this.civilState);
        this.add(this.educationTitle);
        this.add(this.education);



        x = this.sheet.x + PAGE_MARGIN;
        y = TOP_Y;
        this.ageTitle = new TextArea(this.scene, x, y, ABOUT_W, ABOUT_H, this.translate("ageTitle"), ABOUT_TITLES_CONFIG).setOrigin(0, 0.5);
        this.ageTitle.adjustFontSize();

        this.age = new TextArea(this.scene, x + ABOUT_H, y + ABOUT_H, ABOUT_W, ABOUT_H, this.translate("age"), ABOUT_TEXT_CONFIG).setOrigin(0, 0.5);
        this.age.adjustFontSize();


        y += TITLE_SPACING;
        this.skillsTitle = new TextArea(this.scene, x, y, ABOUT_W, ABOUT_H, this.translate("skillsTitle"), ABOUT_TITLES_CONFIG).setOrigin(0, 0.5);
        this.skillsTitle.adjustFontSize();


        let bulletX = x + ABOUT_H / 2;
        y = (this.civilState.y - this.civilState.displayHeight / 2);

        let bulletPointText = this.translate("bulletPoint");
        x2 = bulletX + ABOUT_H / 2;

        let maxWidth = (this.sheet.x + this.sheet.displayWidth / 2) - x2 - PAGE_MARGIN;

        ABOUT_TEXT_CONFIG.fontSize = 18;
        ABOUT_TEXT_CONFIG.wordWrap = {
            width: maxWidth
        }

        // console.log(x2)
        // let rect = this.scene.add.rectangle(x2, y, maxWidth, ABOUT_H, 0x000, 0.4).setOrigin(0, 0);
        // this.add(rect);

        this.skill1Bullet = this.scene.add.text(bulletX, y, bulletPointText, ABOUT_TEXT_CONFIG).setOrigin(0, 0);
        this.skill1 = new TextArea(this.scene, x2, y, maxWidth, ABOUT_H, this.translate("skill1"), ABOUT_TEXT_CONFIG).setOrigin(0, 0);

        y = this.skill1.y + this.skill1.displayHeight + this.BULLET_POINT_SPACING;
        this.skill2Bullet = this.scene.add.text(bulletX, y, bulletPointText, ABOUT_TEXT_CONFIG).setOrigin(0, 0);
        this.skill2 = new TextArea(this.scene, x2, y, maxWidth, ABOUT_H, this.translate("skill2"), ABOUT_TEXT_CONFIG)
            .setOrigin(0, 0);

        y = this.skill2.y + this.skill2.displayHeight + this.BULLET_POINT_SPACING;
        this.skill3Bullet = this.scene.add.text(bulletX, y, bulletPointText, ABOUT_TEXT_CONFIG).setOrigin(0, 0);
        this.skill3 = new TextArea(this.scene, x2, y, maxWidth, ABOUT_H, this.translate("skill3"), ABOUT_TEXT_CONFIG)
            .setOrigin(0, 0);

        y = this.skill3.y + this.skill3.displayHeight + this.BULLET_POINT_SPACING;
        this.skill4Bullet = this.scene.add.text(bulletX, y, bulletPointText, ABOUT_TEXT_CONFIG).setOrigin(0, 0);
        this.skill4 = new TextArea(this.scene, x2, y, maxWidth, ABOUT_H, this.translate("skill4"), ABOUT_TEXT_CONFIG)
            .setOrigin(0, 0);

        y = this.skill4.y + this.skill4.displayHeight + this.BULLET_POINT_SPACING;
        this.skill5Bullet = this.scene.add.text(bulletX, y, bulletPointText, ABOUT_TEXT_CONFIG).setOrigin(0, 0);
        this.skill5 = new TextArea(this.scene, x2, y, maxWidth, ABOUT_H, this.translate("skill5"), ABOUT_TEXT_CONFIG)
            .setOrigin(0, 0);


        this.add(this.ageTitle);
        this.add(this.age);
        this.add(this.skillsTitle);
        this.add(this.skill1Bullet);
        this.add(this.skill1);
        this.add(this.skill2Bullet);
        this.add(this.skill2);
        this.add(this.skill3Bullet);
        this.add(this.skill3);
        this.add(this.skill4Bullet);
        this.add(this.skill4);
        this.add(this.skill5Bullet);
        this.add(this.skill5);
    }

    createDataSection() {
        let DATA_TITLES_X = 621;
        let DATA_TITLES_W = 291;
        let DATA_TITLES_H = 93;

        let DATA_DESCRIPTIONS_PADDING_X = 10;
        let DATA_DESCRIPTIONS_PADDING_Y = 10;
        let DATA_DESCRIPTIONS_X = 964;
        let DATA_DESCRIPTIONS_W = 394 - DATA_DESCRIPTIONS_PADDING_X * 2;
        let DATA_DESCRIPTIONS_H = DATA_TITLES_H - DATA_DESCRIPTIONS_PADDING_Y * 2;

        let DESCRIPTION_TEXT_CONFIG = { ...this.INFO_TEXT_CONFIG };
        DESCRIPTION_TEXT_CONFIG.wordWrap = {
            width: DATA_DESCRIPTIONS_W,
            useAdvancedWrap: true
        }

        let y = 497;
        this.data1Title = new TextArea(this.scene, DATA_TITLES_X, y, DATA_TITLES_W, DATA_TITLES_H, this.translate("data1Title"), this.TITLES_TEXT_CONFIG).setOrigin(0.5, 0.5);
        this.data1Title.adjustFontSize();

        this.data1Description = new TextArea(this.scene, DATA_DESCRIPTIONS_X, y, DATA_DESCRIPTIONS_W, DATA_DESCRIPTIONS_H, this.translate("data1Description"), DESCRIPTION_TEXT_CONFIG)
            .setOrigin(0.5, 0.5);
        this.data1Description.adjustFontSize();


        y = 607;
        this.data2Title = new TextArea(this.scene, DATA_TITLES_X, y, DATA_TITLES_W, DATA_TITLES_H, this.translate("data2Title"), this.TITLES_TEXT_CONFIG).setOrigin(0.5, 0.5);
        this.data2Title.adjustFontSize();

        this.data2Description = new TextArea(this.scene, DATA_DESCRIPTIONS_X, y, DATA_DESCRIPTIONS_W, DATA_DESCRIPTIONS_H, this.translate("data2Description"), DESCRIPTION_TEXT_CONFIG)
            .setOrigin(0.5, 0.5);
        this.data2Description.adjustFontSize();


        y = 718;
        this.data3Title = new TextArea(this.scene, DATA_TITLES_X, y, DATA_TITLES_W, DATA_TITLES_H, this.translate("data3Title"), this.TITLES_TEXT_CONFIG).setOrigin(0.5, 0.5);
        this.data3Title.adjustFontSize();

        this.data3Description = new TextArea(this.scene, DATA_DESCRIPTIONS_X, y, DATA_DESCRIPTIONS_W, DATA_DESCRIPTIONS_H, this.translate("data3Description"), DESCRIPTION_TEXT_CONFIG)
            .setOrigin(0.5, 0.5);
        this.data3Description.adjustFontSize();


        y = 827;
        this.data4Title = new TextArea(this.scene, DATA_TITLES_X, y, DATA_TITLES_W, DATA_TITLES_H, this.translate("data4Title"), this.TITLES_TEXT_CONFIG).setOrigin(0.5, 0.5);
        this.data4Title.adjustFontSize();

        this.data4Description = new TextArea(this.scene, DATA_DESCRIPTIONS_X, y, DATA_DESCRIPTIONS_W, DATA_DESCRIPTIONS_H, this.translate("data4Description"), DESCRIPTION_TEXT_CONFIG)
            .setOrigin(0.5, 0.5);
        this.data4Description.adjustFontSize();


        this.add(this.data1Title);
        this.add(this.data1Description);
        this.add(this.data2Title);
        this.add(this.data2Description);
        this.add(this.data3Title);
        this.add(this.data3Description);
        this.add(this.data4Title);
        this.add(this.data4Description);
    }


    updateInfo(programming = true) {
        // this.skill1.setText()

        let educationReviewed = programming ? "educationReviewedProgramming" : "educationReviewedData";

        let skill2Reviewed = "skill2Reviewed";
        let skill3Reviewed = programming ? "skill3ReviewedProgramming" : "skill3ReviewedData";
        let skill4Reviewed = programming ? "skill4ReviewedProgramming" : "skill4ReviewedData";

        let data1Reviewed = "data1DescriptionReviewed";
        let data2Reviewed = "data2DescriptionReviewed";
        let data4Reviewed = programming ? "data4DescriptionReviewedProgramming" : "data4DescriptionReviewedData";

        this.education.setText(this.translate(educationReviewed));
        this.education.adjustFontSize();


        let y = this.skill2.y;
        this.skill2.setText(this.translate(skill2Reviewed));

        y = this.skill2.y + this.skill2.displayHeight + this.BULLET_POINT_SPACING;
        this.skill3.setText(this.translate(skill3Reviewed));
        this.skill3Bullet.setPosition(this.skill3Bullet.x, y);
        this.skill3.setPosition(this.skill3.x, y);

        y = this.skill3.y + this.skill3.displayHeight + this.BULLET_POINT_SPACING;
        this.skill4.setText(this.translate(skill4Reviewed));
        this.skill4Bullet.setPosition(this.skill4Bullet.x, y);
        this.skill4.setPosition(this.skill4.x, y);


        this.skill5.destroy();
        this.skill5Bullet.destroy();


        this.data1Description.setText(this.translate(data1Reviewed));
        this.data1Description.adjustFontSize();

        this.data2Description.setText(this.translate(data2Reviewed));
        this.data2Description.adjustFontSize();

        this.data4Description.setText(this.translate(data4Reviewed));
        this.data4Description.adjustFontSize();
    }
}