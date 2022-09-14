
SFOLDER=../
DFOLDER=../dist1/
DEPFOLDER=../dist/

## Create Folder
rm -r $DFOLDER
mkdir $DFOLDER
mkdir -p $DFOLDER'app/uploads/tmp'
mkdir -p $DFOLDER'app/uploads/drill'
mkdir -p $DFOLDER'app/uploads/logo'

## Copy required app files
cp -r $SFOLDER'app/css' $DFOLDER'app/'
cp -r $SFOLDER'app/imgs' $DFOLDER'app/'
cp -r $SFOLDER'app/js' $DFOLDER'app/'
cp -r $SFOLDER'app/index.html' $DFOLDER'app/'

## Remove unused files
#rm $DFOLDER'app/css/index.css'
# rm $DFOLDER'app/js/all.js'
rm $DFOLDER'app/js/all.js.map'

## Use minified version
# mv $DFOLDER'app/js/all.min.js' $DFOLDER'app/js/all.js'
#mv $DFOLDER'app/css/index.min.css' $DFOLDER'app/css/index.css'

## Copy server app and related scripts
cp -r $SFOLDER'scripts' $DFOLDER
cp -r $SFOLDER'serverapp' $DFOLDER
cp -r $SFOLDER'server_configs' $DFOLDER
cp -r $SFOLDER'spec' $DFOLDER
cp $SFOLDER'package.json' $DFOLDER
cp $SFOLDER'bower.json' $DFOLDER

##copy build app to deploy folder
cp -r $DFOLDER $DEPFOLDER

## Create zip file
# zip -r sourecode.zip $DFOLDER
# mv sourecode.zip $DFOLDER
